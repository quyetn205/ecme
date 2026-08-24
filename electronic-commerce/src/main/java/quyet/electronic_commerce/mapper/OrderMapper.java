package quyet.electronic_commerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import quyet.electronic_commerce.dto.response.OrderItemResponse;
import quyet.electronic_commerce.dto.response.OrderResponse;
import quyet.electronic_commerce.entity.OrderItem;
import quyet.electronic_commerce.entity.Orders;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target="items",source = "orderItems")
    OrderResponse toOrderResponse(Orders orders);

    @Mapping(target = "productId",source="product.id")
    @Mapping(target = "productName",source = "product.name")
    @Mapping(target = "productImage",source = "product.image")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
