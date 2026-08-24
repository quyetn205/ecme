package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.response.DashboardSummaryResponse;

import quyet.electronic_commerce.dto.response.DailyRevenueResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import java.util.List;

public interface IDashboardService {
    DashboardSummaryResponse getSummary();
    List<DailyRevenueResponse> getDailyRevenue();
    List<OrderResponse> getRecentOrders();
}
