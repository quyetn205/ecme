package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    @NotBlank(message = "Product name cannot be blank")
    String name;
    
    String description;
    
    @NotNull(message = "Price cannot be null")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    Float price;
    
    @NotNull(message = "Quantity cannot be null")
    @PositiveOrZero(message = "Quantity must be greater than or equal to 0")
    Integer quantity;
    
    Long categoryId;
    
    MultipartFile image;
}
