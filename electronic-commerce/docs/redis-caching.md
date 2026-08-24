# Giải thích cơ chế Redis Caching trong dự án eCommerce

Tài liệu này giải thích chi tiết những thay đổi vừa được thực hiện để tích hợp **Redis Cache** vào hệ thống Backend Spring Boot, giúp tối ưu hóa hiệu năng (Performance Optimization) cho dự án.

---

## 1. Mục đích của Caching
Trong một hệ thống eCommerce, có những dữ liệu **rất ít khi thay đổi nhưng lại được truy vấn liên tục**, ví dụ:
- Danh sách các danh mục (Categories) hiển thị trên thanh Menu.
- Chi tiết một sản phẩm đang hot.
- Thống kê tổng quan (Dashboard) cho Admin.

Thay vì mỗi lần có người dùng truy cập, hệ thống lại phải gửi câu lệnh SQL (`SELECT ...`) xuống Database (MySQL) gây chậm chạp và tốn tài nguyên, ta sẽ lưu sẵn (cache) kết quả đó vào **Redis** (một database lưu trữ trên RAM với tốc độ đọc/ghi siêu tốc).
- Lần đầu tiên: `Client -> Spring Boot -> MySQL -> Redis (lưu lại) -> Client`.
- Từ lần thứ 2: `Client -> Spring Boot -> Redis -> Client` (bỏ qua bước gọi MySQL).

---

## 2. Những thành phần đã thêm vào code

### A. Thư viện & Cấu hình (pom.xml & application.yaml)
- **`spring-boot-starter-data-redis`**: Thư viện chính thức của Spring Boot để kết nối với Redis Server.
- Cấu hình `host: localhost` và `port: 6379` trong `application.yaml` để báo cho Spring Boot biết Redis Server đang chạy ở đâu.

### B. Cấu hình Cache Manager (RedisConfig.java)
File `RedisConfig.java` đóng vai trò là "Bộ não điều khiển" cách lưu trữ cache. Dưới đây là đoạn code quan trọng nhất:

```java
@Bean
public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
    // 1. Cấu hình serializer JSON
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
    objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
    GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);

    // 2. Cấu hình mặc định (TTL 30 phút)
    RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer));

    // 3. Cấu hình TTL riêng biệt cho từng cache
    Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
    cacheConfigs.put("categories", defaultConfig.entryTtl(Duration.ofMinutes(60)));
    cacheConfigs.put("dashboard-summary", defaultConfig.entryTtl(Duration.ofMinutes(5)));

    return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
}
```

**Giải thích code:**
1. **JSON Serializer**: Mặc định, Java lưu object vào Redis dưới dạng mã byte (nhìn bằng mắt thường sẽ thấy loằng ngoằng không hiểu được). Đoạn code `ObjectMapper` giúp biến đổi các Java Object (như `CategoryResponse`) thành chuỗi JSON tiêu chuẩn dễ đọc (`{"id": 1, "name": "Laptop"}`).
2. **Cấu hình Default**: Dòng `serializeKeysWith(new StringRedisSerializer())` giúp tên Key lưu trong Redis hiển thị rõ ràng bằng chữ (String) thay vì mã byte.
3. **Cấu hình TTL (Time To Live)**: Quy định thời gian sống của cache bằng `Map<String, RedisCacheConfiguration>`. Nếu để mãi mãi, dữ liệu sẽ bị "thiu" (cũ). 
   - `"categories"`: Set `Duration.ofMinutes(60)` (Vì danh mục hầu như không đổi).
   - `"dashboard-summary"`: Set `Duration.ofMinutes(5)` (Để số liệu kinh doanh không bị lệch quá lâu so với thực tế).

### C. Sử dụng các Annotation trên Service

Spring Boot cung cấp các Annotation cực kỳ mạnh mẽ để áp dụng cache mà không cần viết logic phức tạp.

#### 1. `@Cacheable` (Lưu cache)
- **Nơi dùng**: Trên các hàm `GET` lấy dữ liệu.

```java
@Cacheable(value = "product", key = "#id")
@Override
public ProductResponse getProductById(Long id) {
    // Code query DB...
}
```
- **Hoạt động**: Khi hàm này được gọi, Spring sẽ kiểm tra trong Redis xem có key `product::5` (nếu id=5) chưa. Nếu có, nó trả về luôn dữ liệu trong Redis (bỏ qua hàm Java). Nếu chưa có, nó mới chạy hàm Java, chọc vào MySQL, trả về kết quả và tự động lưu kết quả đó vào Redis.

#### 2. `@CacheEvict` (Xóa cache)
- **Nơi dùng**: Trên các hàm làm thay đổi dữ liệu (CREATE, UPDATE, DELETE).

```java
@CacheEvict(value = "product", key = "#id")
@Override
public ProductResponse updateProduct(Long id, ProductRequest request) {
    // Code sửa DB...
}
```
- **Hoạt động**: Khi bạn sửa sản phẩm, dữ liệu trong MySQL đã đổi, nhưng dữ liệu trong Redis vẫn là cũ. Dẫn đến việc user nhìn thấy giá/tên bị sai. `@CacheEvict` sẽ ra lệnh: "Hãy xóa sạch cache của sản phẩm ID này đi".
- Nhờ vậy, ở lần Get sản phẩm tiếp theo, `@Cacheable` sẽ thấy Redis bị trống và bắt buộc phải query lại DB để cập nhật giá trị mới nhất.

#### 3. `@Caching` (Gom nhóm hành động)
- **Nơi dùng**: Khi bạn có những tác động phức tạp cần xóa nhiều loại cache cùng lúc.

```java
@Caching(evict = {
    @CacheEvict(value = "categories", allEntries = true),
    @CacheEvict(value = "category", key = "#id")
})
@Override
public void deleteCategory(Long id) {
    // Code xóa danh mục...
}
```
- **Hoạt động**: Việc xóa một danh mục ảnh hưởng đến **2 thứ**: thứ nhất là toàn bộ mảng `categories` (menu trang chủ), thứ hai là thông tin của chính `category::id` đó. Dòng `allEntries = true` báo cho Redis biết phải dọn sạch hoàn toàn cái rổ `"categories"`.

---

## 3. Cách kiểm tra Cache đã hoạt động chưa?

Bạn có thể tự kiểm tra bằng mắt thông qua Console (Terminal) chạy Spring Boot:
1. Gọi API lấy danh sách Danh mục (hoặc load lại trang chủ Frontend).
2. Nhìn vào Console, bạn sẽ thấy Hibernate in ra câu SQL: `Hibernate: select c1_0.id, c1_0.name...` (Do lần đầu chưa có cache).
3. Gọi lại API đó một lần nữa.
4. Lần này nhìn vào Console, bạn sẽ **không thấy** câu SQL nào được in ra, nhưng Postman/Frontend vẫn nhận được data. Đó là lúc phép thuật của Redis xuất hiện!
