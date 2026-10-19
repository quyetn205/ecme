package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateQuantityRequest {
    @NotNull(message = "Quantity cannot be null")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    Integer quantity;
}

