package quyet.electronic_commerce.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;
    boolean authenticated;

    /**
     * Refresh token is NOT serialized to JSON response body.
     * It is set as an HttpOnly cookie by the controller instead.
     */
    @JsonIgnore
    String refreshToken;
}
