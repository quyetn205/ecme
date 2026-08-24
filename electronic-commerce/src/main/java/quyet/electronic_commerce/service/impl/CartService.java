package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quyet.electronic_commerce.dto.request.CartItemRequest;
import quyet.electronic_commerce.dto.response.CartItemResponse;
import quyet.electronic_commerce.entity.Cart;
import quyet.electronic_commerce.entity.CartItem;
import quyet.electronic_commerce.entity.Product;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.mapper.CartItemMapper;
import quyet.electronic_commerce.repository.CartItemRepository;
import quyet.electronic_commerce.repository.CartRepository;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.repository.UserRepository;
import quyet.electronic_commerce.service.ICartService;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Service
public class CartService implements ICartService {
    UserRepository userRepository;
    CartRepository cartRepository;
    ProductRepository productRepository;
    CartItemRepository cartItemRepository;
    CartItemMapper cartItemMapper;


    @Transactional
    @Override
    public CartItemResponse addToCart(CartItemRequest request) {
        // 1. Lấy User từ SecurityContext (đã giải mã từ Token)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));
        // 2. Tìm hoặc Tạo Giỏ hàng cho User (1:1)
        Cart cart=cartRepository.findByUserId(user.getId())
                .orElseGet(()->cartRepository.save(Cart.builder().user(user).build()));

        // 3. Kiểm tra sản phẩm có tồn tại và đủ kho không
        Product product=productRepository.findById(request.getProductId())
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        if(product.getStockQuantity()<request.getQuantity()){
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }

        // 4. Kiểm tra sản phẩm đã có trong giỏ chưa
        CartItem cartItem=cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .map(item->{
                    item.setQuantity(item.getQuantity()+request.getQuantity());
                    return item;
                })
                .orElse(CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(request.getQuantity())
                        .price(product.getPrice()) // Lưu giá lúc bỏ vào giỏ
                        .build());
        return cartItemMapper.toResponse(cartItemRepository.save(cartItem));
    }

    @Override
    public List<CartItemResponse> getCartItems() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt=(Jwt)authentication.getPrincipal();
        Long userId=jwt.getClaim("userId");
        Cart cart=cartRepository.findByUserId(userId)
                .orElseThrow(()->new AppException(ErrorCode.NOT_PRODUCT_EXISTED));
        List<CartItem> cartItems=cartItemRepository.findByCartId(cart.getId());

        return cartItems.stream().map(cartItemMapper::toResponse).toList();
    }

    @Transactional
    @Override
    public CartItemResponse updateQuantity(Long id, Integer quantity) {
        CartItem cartItem=cartItemRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.NOT_PRODUCT_EXISTED));

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt=(Jwt)authentication.getPrincipal();
        Long userId=jwt.getClaim("userId");
        if(!cartItem.getCart().getUser().getId().equals(userId)){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if(cartItem.getProduct().getStockQuantity()<quantity){
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
        //ếu quantity = 0 hoặc âm ,xóa luôn Item đó
        if(quantity<=0){
            cartItemRepository.delete(cartItem);
            return null;
        }
        cartItem.setQuantity(quantity);
        return cartItemMapper.toResponse(cartItemRepository.save(cartItem));
    }
}
