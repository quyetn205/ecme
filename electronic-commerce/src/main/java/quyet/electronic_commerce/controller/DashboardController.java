package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.DashboardSummaryResponse;
import quyet.electronic_commerce.dto.response.DailyRevenueResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import quyet.electronic_commerce.service.IDashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {

    IDashboardService dashboardService;

    @Operation(summary = "Lấy thống kê tổng quan Dashboard")
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public APIResponse<DashboardSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return APIResponse.<DashboardSummaryResponse>builder()
                .result(dashboardService.getSummary(startDate, endDate))
                .build();
    }

    @Operation(summary = "Lấy biểu đồ doanh thu theo khoảng thời gian (hoặc 7 ngày qua nếu không truyền)")
    @GetMapping("/revenue-chart")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public APIResponse<List<DailyRevenueResponse>> getDailyRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return APIResponse.<List<DailyRevenueResponse>>builder()
                .result(dashboardService.getDailyRevenue(startDate, endDate))
                .build();
    }

    @Operation(summary = "Lấy 5 đơn hàng gần đây")
    @GetMapping("/recent-orders")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public APIResponse<List<OrderResponse>> getRecentOrders() {
        return APIResponse.<List<OrderResponse>>builder()
                .result(dashboardService.getRecentOrders())
                .build();
    }
}
