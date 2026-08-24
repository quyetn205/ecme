package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import quyet.electronic_commerce.dto.response.DashboardSummaryResponse;
import quyet.electronic_commerce.repository.OrderRepository;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.repository.UserRepository;
import quyet.electronic_commerce.service.IDashboardService;
import quyet.electronic_commerce.mapper.OrderMapper;
import quyet.electronic_commerce.dto.response.DailyRevenueResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import quyet.electronic_commerce.entity.Orders;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class DashboardService implements IDashboardService {

    UserRepository userRepository;
    ProductRepository productRepository;
    OrderRepository orderRepository;
    OrderMapper orderMapper;

    @Cacheable(value = "dashboard-summary")
    @Override
    public DashboardSummaryResponse getSummary() {
        return DashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.calculateTotalRevenue())
                .build();
    }

    @Override
    public List<OrderResponse> getRecentOrders() {
        List<Orders> orders = orderRepository.findAllOrdersWithDetails();
        return orders.stream()
                .limit(5)
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Override
    public List<DailyRevenueResponse> getDailyRevenue() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6);
        List<Orders> recentOrders = orderRepository.findOrdersByOrderDateAfter(sevenDaysAgo.withHour(0).withMinute(0));

        Map<String, Double> revenueByDate = recentOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM")),
                        Collectors.summingDouble(Orders::getTotalPrice)
                ));

        List<DailyRevenueResponse> response = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            String dateStr = LocalDateTime.now().minusDays(i).format(DateTimeFormatter.ofPattern("dd/MM"));
            response.add(new DailyRevenueResponse(dateStr, revenueByDate.getOrDefault(dateStr, 0.0).floatValue()));
        }

        return response;
    }
}
