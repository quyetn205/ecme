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

    @Cacheable(value = "dashboard-summary", key = "{#startDate, #endDate}")
    @Override
    public DashboardSummaryResponse getSummary(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return DashboardSummaryResponse.builder()
                    .totalUsers(userRepository.count())
                    .totalProducts(productRepository.count())
                    .totalOrders(orderRepository.count())
                    .totalRevenue(orderRepository.calculateTotalRevenue())
                    .build();
        }

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        return DashboardSummaryResponse.builder()
                .totalUsers(userRepository.countByCreatedAtBetween(start, end))
                .totalProducts(productRepository.countByCreatedAtBetween(start, end))
                .totalOrders(orderRepository.countByOrderDateBetween(start, end))
                .totalRevenue(orderRepository.calculateTotalRevenueBetween(start, end))
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
    public List<DailyRevenueResponse> getDailyRevenue(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        LocalDateTime start, end;
        if (startDate == null || endDate == null) {
            end = LocalDateTime.now();
            start = end.minusDays(6).withHour(0).withMinute(0).withSecond(0);
        } else {
            start = startDate.atStartOfDay();
            end = endDate.atTime(23, 59, 59);
        }

        List<Orders> recentOrders = orderRepository.findOrdersByOrderDateBetween(start, end);

        Map<String, Double> revenueByDate = recentOrders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()) || "COMPLETED".equals(o.getStatus()))
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM")),
                        Collectors.summingDouble(Orders::getTotalPrice)
                ));

        List<DailyRevenueResponse> response = new ArrayList<>();
        // Lặp từ ngày bắt đầu đến ngày kết thúc
        LocalDateTime current = start;
        while (!current.isAfter(end)) {
            String dateStr = current.format(DateTimeFormatter.ofPattern("dd/MM"));
            response.add(new DailyRevenueResponse(dateStr, revenueByDate.getOrDefault(dateStr, 0.0).floatValue()));
            current = current.plusDays(1);
        }

        return response;
    }
}
