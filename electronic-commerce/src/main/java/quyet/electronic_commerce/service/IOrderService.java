package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.OrderRequest;
import quyet.electronic_commerce.dto.response.OrderResponse;

import java.util.List;

public interface IOrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrder(Long id);
    List<OrderResponse> getAllOrders();
    OrderResponse cancelOrder(Long id);
    List<OrderResponse> getAllOrdersForAdmin();
    OrderResponse updateOrderStatus(Long id, String status);
}
