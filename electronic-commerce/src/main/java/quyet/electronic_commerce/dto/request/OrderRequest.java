package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    @NotEmpty(message = "Cart item IDs cannot be empty")
    List<Long> cartItemIds;
    
    @NotBlank(message = "Full name cannot be blank")
    String fullName;
    
    @NotBlank(message = "Phone number cannot be blank")
    String phoneNumber;
    
    @NotBlank(message = "Address cannot be blank")
    String address;
}
