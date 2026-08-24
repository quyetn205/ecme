package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quyet.electronic_commerce.dto.request.OrderRequest;
import quyet.electronic_commerce.dto.response.OrderResponse;
import quyet.electronic_commerce.entity.CartItem;
import quyet.electronic_commerce.entity.OrderItem;
import quyet.electronic_commerce.entity.Orders;
import quyet.electronic_commerce.entity.Product;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.mapper.OrderMapper;
import quyet.electronic_commerce.repository.CartItemRepository;
import quyet.electronic_commerce.repository.OrderRepository;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.service.IOrderService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
public class OrderService implements IOrderService {
    CartItemRepository cartItemRepository;
    ProductRepository productRepository;
    OrderRepository orderRepository;
    OrderMapper orderMapper;

    @Transactional
    @Override
    public OrderResponse createOrder(OrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId=jwt.getClaim("userId");

        List<CartItem> selectedItems=cartItemRepository.findAllById(request.getCartItemIds());
        boolean unauthorized=selectedItems.stream()
                .anyMatch(item->!item.getCart().getUser().getId().equals(userId));
        if(unauthorized){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if(selectedItems.isEmpty()){
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        // tao order
        Orders orders= Orders.builder()
                .fullName(request.getFullName())
                .address(request.getAddress())
                .phoneNumber(request.getPhoneNumber())
                .orderDate(LocalDateTime.now())
                .status("PENDING")
                .user(selectedItems.get(0).getCart().getUser())
                .build();
        List<OrderItem> orderItems=new ArrayList<>();
        Float totalPrice=0f;
        //Chuyển từ CartItem sang OrderItem & Trừ kho
        for(CartItem cartItem:selectedItems){
            Product product=cartItem.getProduct();
            // Trừ tồn kho trực tiếp bằng Database (Native Update) để chống Race Condition
            int updatedRows = productRepository.decrementStock(product.getId(), cartItem.getQuantity());
            if(updatedRows == 0) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }
            // Tạo OrderItem (Lưu giá chốt tại thời điểm mua)
            OrderItem orderItem=OrderItem.builder()
                    .priceAtOrder(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .order(orders)
                    .product(product)
                    .build();
            orderItems.add(orderItem);
            totalPrice+=product.getPrice()*cartItem.getQuantity();
        }
        orders.setTotalPrice(totalPrice);
        orders.setOrderItems(orderItems);
        //Lưu đơn hàng và Xóa mon da dat trong giỏ hàng
        cartItemRepository.deleteAll(selectedItems);
        return orderMapper.toOrderResponse(orderRepository.save(orders));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("userId");

        Orders orders = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        if (!orders.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return orderMapper.toOrderResponse(orders);
    }

@Override
    public List<OrderResponse> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId=jwt.getClaim("userId");

        List<Orders> ordersList=orderRepository.findAllOrdersByUserIdWithDetails(userId);
        return ordersList.stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Transactional
    @Override
    public OrderResponse cancelOrder(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId=jwt.getClaim("userId");

        Orders orders=orderRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        // Chỉ chủ sở hữu đơn mới được hủy
        if(!orders.getUser().getId().equals(userId)){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Chỉ hủy được đơn đang ở trạng thái PENDING
        if(!"PENDING".equals(orders.getStatus())){
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        // Hoàn lại tồn kho cho từng sản phẩm trong đơn
        if(orders.getOrderItems()!=null){
            orders.getOrderItems().forEach(orderItem -> {
                Product product=orderItem.getProduct();
                productRepository.incrementStock(product.getId(), orderItem.getQuantity());
            });
        }

        orders.setStatus("CANCELLED");
        return orderMapper.toOrderResponse(orderRepository.save(orders));
    }

    @Override
    public List<OrderResponse> getAllOrdersForAdmin() {
        List<Orders> ordersList = orderRepository.findAllOrdersWithDetails();
        return ordersList.stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Transactional
    @Override
    public OrderResponse updateOrderStatus(Long id, String status) {
        Orders orders = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        // Không cho phép đổi trạng thái của đơn đã CANCELLED (hoặc thêm hoàn kho nếu cần)
        if ("CANCELLED".equals(orders.getStatus())) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL); // Có thể tạo ErrorCode mới như STATUS_INVALID, nhưng dùng tạm
        }

        List<String> validStatuses = List.of("PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED");
        if (!validStatuses.contains(status)) {
            throw new AppException(ErrorCode.INVALID_KEY); // Hoặc dùng Exception tùy ý
        }

        // Nếu admin đổi sang CANCELLED, hoàn kho
        if ("CANCELLED".equals(status)) {
            if (orders.getOrderItems() != null) {
                orders.getOrderItems().forEach(orderItem -> {
                    Product product = orderItem.getProduct();
                    productRepository.incrementStock(product.getId(), orderItem.getQuantity());
                });
            }
        }

        orders.setStatus(status);
        return orderMapper.toOrderResponse(orderRepository.save(orders));
    }
}
