package quyet.electronic_commerce.service.impl;

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
        var token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }
}
