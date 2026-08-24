package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.CartItemRequest;
import quyet.electronic_commerce.dto.response.CartItemResponse;

import java.util.List;

public interface ICartService {
    CartItemResponse addToCart(CartItemRequest request);
    List<CartItemResponse> getCartItems();
    CartItemResponse updateQuantity(Long id,Integer quantity);
}
