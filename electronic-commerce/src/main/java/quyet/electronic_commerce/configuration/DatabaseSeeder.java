package quyet.electronic_commerce.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import quyet.electronic_commerce.entity.*;
import quyet.electronic_commerce.enums.RoleEnum;
import quyet.electronic_commerce.repository.*;

import java.time.LocalDateTime;
import java.util.*;

// @Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    UserRepository userRepository;
    RoleRepository roleRepository;
    CategoryRepository categoryRepository;
    ProductRepository productRepository;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    OrderRepository orderRepository;
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Roles always
        seedRoles();
        
        // 2. Seed Employee User always
        seedEmployeeUser();

        // Chỉ seed dữ liệu mẫu khác khi chưa có Category nào trong DB
        if (categoryRepository.count() == 0) {
            log.info("Bắt đầu tạo dữ liệu mẫu (Mock Data)...");

            // Seed Users
            User admin = seedAdminUser();
            List<User> users = seedNormalUsers();

            // 3. Seed Categories
            List<Category> categories = seedCategories();

            // 4. Seed Products
            List<Product> products = seedProducts(categories);

            // 5. Seed Cart cho User 1 (user@example.com)
            seedCart(users.get(0), products);

            // 6. Seed Orders cho User 1
            seedOrders(users.get(0), products);

            log.info("Tạo dữ liệu mẫu thành công!");
        } else {
            log.info("Dữ liệu đã tồn tại. Bỏ qua bước tạo dữ liệu mẫu.");
        }
    }

    private void seedRoles() {
        if (!roleRepository.existsById(RoleEnum.USER.name())) {
            roleRepository.save(Role.builder()
                    .name(RoleEnum.USER.name())
                    .description("User role")
                    .build());
        }
        if (!roleRepository.existsById(RoleEnum.ADMIN.name())) {
            roleRepository.save(Role.builder()
                    .name(RoleEnum.ADMIN.name())
                    .description("Admin role")
                    .build());
        }
        if (!roleRepository.existsById(RoleEnum.EMPLOYEE.name())) {
            roleRepository.save(Role.builder()
                    .name(RoleEnum.EMPLOYEE.name())
                    .description("Employee role")
                    .build());
        }
    }

    private User seedAdminUser() {
        Optional<User> existingAdmin = userRepository.findByEmail("admin@example.com");
        if (existingAdmin.isPresent()) return existingAdmin.get();

        Role adminRole = roleRepository.findById(RoleEnum.ADMIN.name()).orElseThrow();
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        User admin = User.builder()
                .username("admin_test")
                .email("admin@example.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("Quản trị viên")
                .phone("0987654321")
                .status(true)
                .authProvider("LOCAL")
                .roles(roles)
                .build();
        return userRepository.save(admin);
    }

    private User seedEmployeeUser() {
        Optional<User> existingEmployee = userRepository.findByEmail("employee@example.com");
        if (existingEmployee.isPresent()) return existingEmployee.get();

        Role employeeRole = roleRepository.findById(RoleEnum.EMPLOYEE.name()).orElseThrow();
        Set<Role> roles = new HashSet<>();
        roles.add(employeeRole);

        User employee = User.builder()
                .username("employee_test")
                .email("employee@example.com")
                .password(passwordEncoder.encode("Employee@123"))
                .fullName("Nhân viên bán hàng")
                .phone("0987654322")
                .status(true)
                .authProvider("LOCAL")
                .roles(roles)
                .build();
        return userRepository.save(employee);
    }

    private List<User> seedNormalUsers() {
        Role userRole = roleRepository.findById(RoleEnum.USER.name()).orElseThrow();
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        List<User> users = new ArrayList<>();
        
        // User chính để test
        if (userRepository.findByEmail("user@example.com").isEmpty()) {
            User user1 = User.builder()
                    .username("user_test")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("User@123"))
                    .fullName("Khách hàng 1")
                    .phone("0123456789")
                    .status(true)
                    .authProvider("LOCAL")
                    .roles(roles)
                    .build();
            users.add(userRepository.save(user1));
        }

        // Tạo thêm vài user ngẫu nhiên
        for (int i = 2; i <= 5; i++) {
            if (userRepository.findByEmail("user" + i + "@example.com").isEmpty()) {
                User u = User.builder()
                        .username("user_test_" + i)
                        .email("user" + i + "@example.com")
                        .password(passwordEncoder.encode("User@123"))
                        .fullName("Khách hàng " + i)
                        .phone("012345678" + i)
                        .status(true)
                        .authProvider("LOCAL")
                        .roles(roles)
                        .build();
                users.add(userRepository.save(u));
            }
        }
        return users;
    }

    private List<Category> seedCategories() {
        List<Category> categories = Arrays.asList(
                Category.builder().name("Điện thoại di động").description("Các dòng smartphone mới nhất").build(),
                Category.builder().name("Laptop & Macbook").description("Máy tính xách tay cấu hình cao").build(),
                Category.builder().name("Phụ kiện công nghệ").description("Tai nghe, củ sạc, ốp lưng").build(),
                Category.builder().name("Đồng hồ thông minh").description("Apple Watch, Samsung Galaxy Watch").build(),
                Category.builder().name("Máy tính bảng").description("iPad, Galaxy Tab").build()
        );
        return categoryRepository.saveAll(categories);
    }

    private List<Product> seedProducts(List<Category> categories) {
        List<Product> products = new ArrayList<>();
        Random random = new Random();

        for (Category category : categories) {
            // Mỗi danh mục tạo 5-8 sản phẩm
            int productCount = 5 + random.nextInt(4);
            for (int i = 1; i <= productCount; i++) {
                // Giá từ 100,000 đến 50,000,000 (bội số của 1000)
                float price = 100000f + (random.nextInt(500) * 100000f);
                int stock = random.nextInt(100);

                Product p = Product.builder()
                        .name(category.getName() + " Mẫu " + i)
                        .description("Đây là mô tả chi tiết cho sản phẩm " + category.getName() + " Mẫu " + i + ". Sản phẩm chính hãng, bảo hành 12 tháng.")
                        .price(price)
                        .stockQuantity(stock)
                        .image("https://via.placeholder.com/300?text=" + category.getName().replace(" ", "+") + "+" + i)
                        .category(category)
                        .build();
                products.add(p);
            }
        }
        return productRepository.saveAll(products);
    }

    private void seedCart(User user, List<Product> products) {
        if (cartRepository.findByUserId(user.getId()).isPresent()) return;

        Cart cart = Cart.builder()
                .user(user)
                .status("ACTIVE")
                .build();
        cart = cartRepository.save(cart);

        // Thêm 3 sản phẩm ngẫu nhiên vào giỏ hàng
        Random random = new Random();
        for (int i = 0; i < 3; i++) {
            Product p = products.get(random.nextInt(products.size()));
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(p)
                    .quantity(1 + random.nextInt(3))
                    .price(p.getPrice())
                    .build();
            cartItemRepository.save(item);
        }
    }

    private void seedOrders(User user, List<Product> products) {
        String[] statuses = {"PENDING", "SHIPPED", "COMPLETED", "CANCELLED"};
        Random random = new Random();

        // Tạo 4 đơn hàng với 4 trạng thái khác nhau
        for (String status : statuses) {
            Orders order = Orders.builder()
                    .user(user)
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhone())
                    .address("123 Đường Test, Quận 1, TP HCM")
                    .orderDate(LocalDateTime.now().minusDays(random.nextInt(30))) // Cách đây vài ngày ngẫu nhiên
                    .status(status)
                    .build();
            
            order = orderRepository.save(order);

            List<OrderItem> items = new ArrayList<>();
            float totalPrice = 0f;
            // Thêm 1-3 OrderItems cho mỗi Order
            int itemCount = 1 + random.nextInt(3);
            for (int i = 0; i < itemCount; i++) {
                Product p = products.get(random.nextInt(products.size()));
                int qty = 1 + random.nextInt(2);
                float itemPrice = p.getPrice();
                
                OrderItem item = OrderItem.builder()
                        .order(order)
                        .product(p)
                        .quantity(qty)
                        .priceAtOrder(itemPrice)
                        .build();
                items.add(item);
                totalPrice += (qty * itemPrice);
            }

            order.setOrderItems(items);
            order.setTotalPrice(totalPrice);
            orderRepository.save(order);
        }
    }
}
