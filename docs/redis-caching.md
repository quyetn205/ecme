# Redis Caching — Tài liệu kỹ thuật

## 1. Tổng quan

### Vấn đề
Trong hệ thống eCommerce, mỗi khi người dùng truy cập trang chủ, Backend phải gửi câu lệnh SQL xuống MySQL để lấy danh sách Danh mục (Categories), chi tiết Sản phẩm, Thống kê Dashboard... Những dữ liệu này **rất ít khi thay đổi** nhưng lại **bị truy vấn liên tục**, gây lãng phí tài nguyên Database.

### Giải pháp
Tích hợp **Redis** (một database lưu trữ trên RAM, tốc độ đọc/ghi siêu nhanh) làm lớp Cache trung gian giữa Spring Boot và MySQL:
- **Lần đầu**: `Client → Spring Boot → MySQL → Redis (lưu lại) → Client`
- **Từ lần thứ 2**: `Client → Spring Boot → Redis → Client` (bỏ qua MySQL hoàn toàn)

### Công nghệ sử dụng
- **Redis Server**: Chạy trên Docker (`docker run -d -p 6379:6379 redis`)
- **Spring Boot Starter**: `spring-boot-starter-data-redis`
- **Spring Cache Abstraction**: `@Cacheable`, `@CacheEvict`, `@Caching`

---

## 2. Cấu trúc file

```
electronic-commerce/
├── pom.xml                          ← Thêm dependency Redis
├── src/main/resources/
│   └── application.yaml             ← Thêm config kết nối Redis
└── src/main/java/.../
    ├── configuration/
    │   └── RedisConfig.java         ← [MỚI] Cấu hình CacheManager + TTL
    ├── dto/response/
    │   ├── CategoryResponse.java    ← Thêm implements Serializable
    │   ├── ProductResponse.java     ← Thêm implements Serializable
    │   └── DashboardSummaryResponse.java ← Thêm implements Serializable
    └── service/impl/
        ├── CategoryService.java     ← Thêm @Cacheable / @CacheEvict
        ├── ProductService.java      ← Thêm @Cacheable / @CacheEvict
        └── DashboardService.java    ← Thêm @Cacheable
```

---

## 3. Chi tiết từng file

### A. Dependency (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

Thư viện chính thức của Spring Boot để kết nối Redis Server. Bao gồm sẵn Lettuce (Redis client) và Spring Cache.

### B. Cấu hình kết nối (application.yaml)

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

Báo cho Spring Boot biết Redis Server đang chạy ở đâu. Mặc định Redis lắng nghe trên cổng `6379`.

### C. Cấu hình CacheManager (RedisConfig.java)

```java
@Configuration
@EnableCaching  // Kích hoạt tính năng Cache cho toàn bộ ứng dụng
public class RedisConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Cấu hình mặc định: JDK Serializer, TTL = 30 phút
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(...new StringRedisSerializer()...)
                .disableCachingNullValues();

        // Cấu hình TTL riêng cho từng cache
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("categories", defaultConfig.entryTtl(Duration.ofMinutes(60)));
        cacheConfigs.put("category",   defaultConfig.entryTtl(Duration.ofMinutes(60)));
        cacheConfigs.put("product",    defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("dashboard-summary", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}
```

**Giải thích:**
- `@EnableCaching`: Annotation "công tắc" để bật toàn bộ cơ chế Cache trong Spring.
- `StringRedisSerializer`: Đảm bảo tên Key hiển thị dạng chữ rõ ràng trong Redis (VD: `categories::SimpleKey []`).
- `entryTtl(Duration)`: **TTL (Time To Live)** — thời gian sống của cache. Sau khi hết TTL, Redis tự động xóa dữ liệu cũ. Lần gọi tiếp theo sẽ phải query lại DB.
- `disableCachingNullValues()`: Không cache kết quả `null` — tránh lỗi NullPointer khi đọc cache.

**Bảng TTL:**

| Cache name | TTL | Lý do |
|------------|-----|-------|
| `categories` | 60 phút | Danh mục hầu như không đổi |
| `category` | 60 phút | Chi tiết 1 danh mục cũng ít đổi |
| `product` | 30 phút | Sản phẩm có thể đổi giá/tồn kho |
| `dashboard-summary` | 5 phút | Thống kê cần cập nhật thường xuyên hơn |

### D. DTO — implements Serializable

```java
public class CategoryResponse implements Serializable { ... }
public class ProductResponse implements Serializable { ... }
public class DashboardSummaryResponse implements Serializable { ... }
```

**Tại sao cần `Serializable`?**
Redis lưu dữ liệu dưới dạng mảng byte. Để Java chuyển đổi (serialize) một Object thành byte[] và ngược lại (deserialize), class đó **bắt buộc** phải implement interface `Serializable`. Nếu thiếu, Spring sẽ ném ra `SerializationException` → API trả về lỗi 500.

---

## 4. Cách sử dụng các Annotation

### `@Cacheable` — Lưu cache khi đọc dữ liệu

```java
// CategoryService.java
@Cacheable(value = "categories")
public List<CategoryResponse> getAllCategories() {
    return categoryRepository.findAll().stream()
            .map(categoryMapper::toResponse)
            .toList();
}
```

**Luồng hoạt động:**
1. Lần 1: Spring kiểm tra Redis → không có key `categories` → chạy hàm Java → query MySQL → lưu kết quả vào Redis → trả về Client.
2. Lần 2+: Spring kiểm tra Redis → **có** key `categories` → trả về luôn từ Redis → **không chạy hàm Java, không query MySQL**.

```java
// ProductService.java
@Cacheable(value = "product", key = "#id")
public ProductResponse getProductById(Long id) { ... }
```

Tham số `key = "#id"` nghĩa là mỗi sản phẩm được lưu thành 1 entry riêng biệt:
- `product::1` → cache của sản phẩm ID=1
- `product::5` → cache của sản phẩm ID=5

### `@CacheEvict` — Xóa cache khi ghi dữ liệu

```java
// CategoryService.java
@CacheEvict(value = "categories", allEntries = true)
public CategoryResponse createCategory(CategoryRequest request) { ... }
```

Khi tạo mới một Category, dữ liệu MySQL đã thay đổi nhưng Redis vẫn giữ list cũ. `@CacheEvict` ra lệnh **xóa sạch** cache `categories` để lần GET tiếp theo phải query lại DB, đảm bảo dữ liệu luôn đúng.

```java
// ProductService.java
@CacheEvict(value = "product", key = "#id")
public ProductResponse updateProduct(Long id, ProductRequest request) { ... }
```

Chỉ xóa cache của **đúng sản phẩm bị sửa** (theo ID), không ảnh hưởng cache của các sản phẩm khác.

### `@Caching` — Gom nhiều hành động cache

```java
// CategoryService.java
@Caching(evict = {
    @CacheEvict(value = "categories", allEntries = true),
    @CacheEvict(value = "category", key = "#id")
})
public void deleteCategory(Long id) { ... }
```

Khi xóa một danh mục, cần xóa **2 loại cache** cùng lúc:
1. `categories` (toàn bộ danh sách) vì list đã thay đổi.
2. `category::id` (chi tiết danh mục đó) vì nó không còn tồn tại.

`@Caching` cho phép gom nhiều `@CacheEvict` thành 1 annotation duy nhất.

---

## 5. Kiểm chứng Cache hoạt động

### Cách 1: Đọc log Hibernate
1. Gọi API `GET /categories` lần 1 → Console in ra `Hibernate: select c1_0.id...`
2. Gọi lại `GET /categories` lần 2 → Console **KHÔNG in ra SQL** → Cache đã hoạt động!

### Cách 2: Kiểm tra trực tiếp trong Redis
```bash
# Vào Redis CLI trong Docker
docker exec -it <container_id> redis-cli

# Xem tất cả key đang được cache
KEYS *

# Xem TTL còn lại của 1 key (tính bằng giây)
TTL "categories::SimpleKey []"

# Xóa toàn bộ cache (khi cần reset)
FLUSHALL
```

---

## 6. Lưu ý quan trọng

| Lưu ý | Chi tiết |
|--------|----------|
| **Không cache Order** | Đơn hàng thay đổi liên tục (tạo, đổi trạng thái), cache sẽ gây sai lệch dữ liệu |
| **Không cache danh sách Product** | API `getAllProducts()` có pagination + filter, mỗi tổ hợp param tạo ra 1 cache riêng → tốn bộ nhớ Redis không cần thiết |
| **Luôn thêm `@CacheEvict`** | Mỗi khi thêm `@Cacheable` vào 1 hàm GET, phải thêm `@CacheEvict` vào tất cả hàm CREATE/UPDATE/DELETE liên quan. Nếu quên, user sẽ thấy dữ liệu cũ |
| **Redis phải đang chạy** | Nếu Docker container bị tắt, Spring Boot sẽ không khởi động được. Chạy `docker start <id>` trước |
