package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.AuthenticationRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.AuthenticationResponse;
import quyet.electronic_commerce.service.IAuthenticationService;
import quyet.electronic_commerce.service.impl.GoogleAuthService;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
public class AuthenticationController {
    IAuthenticationService authenticationService;
    GoogleAuthService googleAuthService;

    @NonFinal
    @Value("${google.client-id}")
    String googleClientId;

    @NonFinal
    @Value("${google.redirect-uri}")
    String googleRedirectUri;

    @NonFinal
    @Value("${google.authorization-uri}")
    String googleAuthorizationUri;

    @NonFinal
    @Value("${app.frontend-url}")
    String frontendUrl;

    @Operation(summary = "Authenticate user", description = "API authenticate user and return JWT token")
    @PostMapping("/token")
    APIResponse<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return APIResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @Operation(summary = "Initiate Google Login", description = "Redirect user to Google consent screen")
    @GetMapping("/google/login")
    public void googleLogin(HttpServletResponse response) throws IOException {
        String scope = URLEncoder.encode("openid email profile", StandardCharsets.UTF_8);
        String redirectUriEncoded = URLEncoder.encode(googleRedirectUri, StandardCharsets.UTF_8);

        String googleAuthUrl = googleAuthorizationUri
                + "?client_id=" + googleClientId
                + "&redirect_uri=" + redirectUriEncoded
                + "&response_type=code"
                + "&scope=" + scope
                + "&access_type=offline";

        response.sendRedirect(googleAuthUrl);
    }

    @Operation(summary = "Google OAuth2 Callback", description = "Handle Google OAuth2 callback and return system JWT")
    @GetMapping("/google/callback")
    public void googleCallback(@RequestParam(required = false) String code,
                               @RequestParam(required = false) String error,
                               HttpServletResponse response) throws IOException {
        if (error != null || code == null) {
            log.warn("Google OAuth2 error: {}", error);
            response.sendRedirect(frontendUrl + "/auth/login?error=google_denied");
            return;
        }

        try {
            AuthenticationResponse authResponse = googleAuthService.loginWithGoogle(code);
            String token = URLEncoder.encode(authResponse.getToken(), StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/auth/callback?token=" + token);
        } catch (Exception e) {
            log.error("Google login failed", e);
            response.sendRedirect(frontendUrl + "/auth/login?error=google_failed");
        }
    }
}
