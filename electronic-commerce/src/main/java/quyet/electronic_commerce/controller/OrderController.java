package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import quyet.electronic_commerce.dto.request.OrderRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import quyet.electronic_commerce.service.IOrderService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@RequestMapping("/orders")
public class OrderController {
    IOrderService orderService;

    @Operation(summary = "create order" , description = "API create order")
    @PostMapping()
    APIResponse<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        return APIResponse.<OrderResponse>builder()
                .result(orderService.createOrder(orderRequest))
                .build();
    }

    @Operation(summary = "get order by id" , description = "API get order by id")
    @GetMapping("/{id}")
    APIResponse<OrderResponse> getOrder(@PathVariable Long id) {
        return APIResponse.<OrderResponse>builder()
                .result(orderService.getOrder(id))
                .build();
    }

@Operation(summary = "get all orders" , description = "API get all orders")
    @GetMapping
        APIResponse<List<OrderResponse>> getAllOrders() {
        return APIResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrders())
                .build();
    }

    @Operation(summary = "cancel order" , description = "API cancel order by id")
    @PatchMapping("/{id}/cancel")
    APIResponse<OrderResponse> cancelOrder(@PathVariable Long id) {
        return APIResponse.<OrderResponse>builder()
                .result(orderService.cancelOrder(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "get all orders for admin" , description = "API get all orders for admin")
    @GetMapping("/admin")
    APIResponse<List<OrderResponse>> getAllOrdersForAdmin() {
        return APIResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrdersForAdmin())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "update order status" , description = "API update order status")
    @PatchMapping("/{id}/status")
    APIResponse<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return APIResponse.<OrderResponse>builder()
                .result(orderService.updateOrderStatus(id, status))
                .build();
    }
}
