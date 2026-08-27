package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.response.DashboardSummaryResponse;

import quyet.electronic_commerce.dto.response.DailyRevenueResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import java.util.List;

public interface IDashboardService {
    DashboardSummaryResponse getSummary(java.time.LocalDate startDate, java.time.LocalDate endDate);
    List<DailyRevenueResponse> getDailyRevenue(java.time.LocalDate startDate, java.time.LocalDate endDate);
    List<OrderResponse> getRecentOrders();
}
