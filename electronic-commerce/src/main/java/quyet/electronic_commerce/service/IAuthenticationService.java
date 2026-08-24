package quyet.electronic_commerce.service;

import org.springframework.web.bind.annotation.RequestBody;
import quyet.electronic_commerce.dto.request.AuthenticationRequest;
import quyet.electronic_commerce.dto.response.AuthenticationResponse;

public interface IAuthenticationService {
    AuthenticationResponse authenticate( AuthenticationRequest request);
}
