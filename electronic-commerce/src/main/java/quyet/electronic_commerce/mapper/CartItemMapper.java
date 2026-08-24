package quyet.electronic_commerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import quyet.electronic_commerce.dto.response.CartItemResponse;
import quyet.electronic_commerce.entity.CartItem;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(source = "product.id",target = "productId")
    @Mapping(source = "product.name",target = "productName")
    @Mapping(source = "product.image",target = "productImage")
    CartItemResponse toResponse(CartItem cartItem);
}
