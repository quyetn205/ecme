package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @NotBlank(message = "Old password cannot be blank")
    String oldPassword;
    
    @NotBlank(message = "New password cannot be blank")
    @Size(min=4, message = "PASSWORD_INVALID")
    String newPassword;
}
