package quyet.electronic_commerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
//    Long id;
    @NotBlank(message = "Username cannot be blank")
    @Size(min=4,message = "USERNAME_INVALID")
    String username;
    
    @NotBlank(message = "Password cannot be blank")
    @Size(min=4,message = "PASSWORD_INVALID")
    String password;
    
    @NotBlank(message = "Full name cannot be blank")
    String fullName;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    String email;
}
