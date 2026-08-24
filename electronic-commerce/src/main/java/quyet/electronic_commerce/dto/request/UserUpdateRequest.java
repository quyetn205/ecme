package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotBlank(message = "Full name cannot be blank")
    String fullName;
    String phone;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    String email;
}
