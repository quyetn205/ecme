package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {
    @NotNull(message = "Product ID cannot be null")
    Long productId;
    
    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be greater than 0")
    Integer quantity;
}
