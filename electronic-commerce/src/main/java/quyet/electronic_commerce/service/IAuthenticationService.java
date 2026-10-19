package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.AuthenticationRequest;
import quyet.electronic_commerce.dto.response.AuthenticationResponse;

public interface IAuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    AuthenticationResponse refreshToken(String refreshToken);
}
