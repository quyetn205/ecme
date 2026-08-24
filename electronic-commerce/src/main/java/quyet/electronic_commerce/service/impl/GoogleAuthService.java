package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import quyet.electronic_commerce.dto.response.AuthenticationResponse;
import quyet.electronic_commerce.dto.response.GoogleTokenResponse;
import quyet.electronic_commerce.dto.response.GoogleUserInfo;
import quyet.electronic_commerce.entity.Role;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.enums.RoleEnum;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.repository.RoleRepository;
import quyet.electronic_commerce.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleAuthService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    JwtService jwtService;
    RestTemplate restTemplate;

    @NonFinal
    @Value("${google.client-id}")
    String clientId;

    @NonFinal
    @Value("${google.client-secret}")
    String clientSecret;

    @NonFinal
    @Value("${google.redirect-uri}")
    String redirectUri;

    @NonFinal
    @Value("${google.token-uri}")
    String tokenUri;

    @NonFinal
    @Value("${google.user-info-uri}")
    String userInfoUri;

    public GoogleAuthService(UserRepository userRepository,
                             RoleRepository roleRepository,
                             JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.restTemplate = new RestTemplate();
    }

    public AuthenticationResponse loginWithGoogle(String code) {
        // Step 1: Exchange authorization code for access token
        GoogleTokenResponse tokenResponse = exchangeCodeForToken(code);

        // Step 2: Fetch Google user info
        GoogleUserInfo userInfo = fetchGoogleUserInfo(tokenResponse.getAccessToken());

        // Validate email
        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Step 3: Find or create user
        User user = findOrCreateUser(userInfo);

        // Step 4: Generate system JWT
        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private GoogleTokenResponse exchangeCodeForToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<GoogleTokenResponse> response = restTemplate.postForEntity(
                    tokenUri, request, GoogleTokenResponse.class);

            if (response.getBody() == null || response.getBody().getAccessToken() == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to exchange Google code for token", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private GoogleUserInfo fetchGoogleUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
                    userInfoUri, HttpMethod.GET, request, GoogleUserInfo.class);

            if (response.getBody() == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch Google user info", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private User findOrCreateUser(GoogleUserInfo googleUserInfo) {
        String email = googleUserInfo.getEmail();

        // If user with this email already exists (either LOCAL or GOOGLE), use that account
        return userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Creating new Google user for email: {}", email);

            // Generate unique username from email to avoid conflicts
            String baseUsername = "google_" + email.replace("@", "_").replace(".", "_");
            String username = baseUsername;
            int suffix = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + "_" + suffix++;
            }

            Role userRole = roleRepository.findById(RoleEnum.USER.name())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);

            User newUser = User.builder()
                    .username(username)
                    .password(null) // No password for Google accounts
                    .fullName(googleUserInfo.getName())
                    .email(email)
                    .status(true)
                    .authProvider("GOOGLE")
                    .roles(roles)
                    .build();

            return userRepository.save(newUser);
        });
    }
}
