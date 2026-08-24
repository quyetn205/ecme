package quyet.electronic_commerce.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleUserInfo {
    @JsonProperty("sub")
    private String sub;           // Google user ID

    @JsonProperty("email")
    private String email;

    @JsonProperty("name")
    private String name;

    @JsonProperty("picture")
    private String picture;

    @JsonProperty("email_verified")
    private Boolean emailVerified;
}
