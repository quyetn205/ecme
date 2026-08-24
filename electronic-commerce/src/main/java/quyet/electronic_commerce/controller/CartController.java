package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.CartItemRequest;
import quyet.electronic_commerce.dto.request.UpdateQuantityRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.CartItemResponse;
import quyet.electronic_commerce.service.ICartService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@RequestMapping("/cart")
public class CartController {
    ICartService cartService;

    @Operation(summary = "add item to cart" , description = "API add item to cart")
    @PostMapping("/add")
    APIResponse<CartItemResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        return APIResponse.<CartItemResponse>builder()
                .result(cartService.addToCart(request))
                .build();
    }

    @Operation(summary = "get cart items" , description = "API get cart items")
    @GetMapping
    APIResponse<List<CartItemResponse>> getCartItems() {
        return APIResponse.<List<CartItemResponse>>builder()
                .result(cartService.getCartItems())
                .build();
    }

    @Operation(summary = "update quantity of cart item" , description = "API update quantity of cart item")
    @PutMapping("/item/{id}")
    APIResponse<CartItemResponse> updateQuantity(@PathVariable Long id, @Valid @RequestBody UpdateQuantityRequest request) {
        return APIResponse.<CartItemResponse>builder()
                .result(cartService.updateQuantity(id,request.getQuantity()))
                .build();
    }

}
