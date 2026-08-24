package quyet.electronic_commerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    Long id;
    Long productId;
    String productName;
    String productImage;
    Float price;
    Integer quantity;
    //Float subTotal; // price * quantity
}
