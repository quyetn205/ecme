package quyet.electronic_commerce.service.impl;

import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import quyet.electronic_commerce.dto.request.AuthenticationRequest;
import quyet.electronic_commerce.dto.response.AuthenticationResponse;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.repository.UserRepository;
import quyet.electronic_commerce.service.IAuthenticationService;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class AuthenticationService implements IAuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (!user.isStatus()) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return buildAuthResponse(user);
    }

    @Override
    public AuthenticationResponse refreshToken(String refreshToken) {
        // Verify the refresh token signature and expiration
        SignedJWT signedJWT = jwtService.verifyToken(refreshToken);

        // Ensure it's actually a refresh token, not an access token
        if (!jwtService.isRefreshToken(signedJWT)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Get user from token subject
        String username = jwtService.getUsernameFromToken(signedJWT);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!user.isStatus()) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }

        return buildAuthResponse(user);
    }

    private AuthenticationResponse buildAuthResponse(User user) {
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }
}
