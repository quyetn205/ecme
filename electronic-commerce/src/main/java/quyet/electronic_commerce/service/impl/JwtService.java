package quyet.electronic_commerce.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
public class JwtService {

    @NonFinal
    @Value("${jwt.signerKey}")
    String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${jwt.issuer}")
    String ISSUER;

    public String generateToken(User user) {
        return buildToken(user, VALID_DURATION, "access");
    }

    public String generateRefreshToken(User user) {
        return buildToken(user, REFRESHABLE_DURATION, "refresh");
    }

    /**
     * Verify and parse a JWT token.
     * @throws AppException if the token is invalid or expired
     */
    public SignedJWT verifyToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes(StandardCharsets.UTF_8));
            if (!signedJWT.verify(verifier)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime == null || expirationTime.before(new Date())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            return signedJWT;
        } catch (ParseException | JOSEException e) {
            log.error("Token verification failed", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    /**
     * Check if the given verified JWT is a refresh token.
     */
    public boolean isRefreshToken(SignedJWT signedJWT) {
        try {
            String type = (String) signedJWT.getJWTClaimsSet().getClaim("type");
            return "refresh".equals(type);
        } catch (ParseException e) {
            return false;
        }
    }

    /**
     * Extract username (subject) from a verified JWT.
     */
    public String getUsernameFromToken(SignedJWT signedJWT) {
        try {
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public long getRefreshableDuration() {
        return REFRESHABLE_DURATION;
    }

    private String buildToken(User user, long durationSeconds, String tokenType) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("type", tokenType)
                .issuer(ISSUER)
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(durationSeconds, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);

        try {
            signedJWT.sign(new MACSigner(SIGNER_KEY.getBytes(StandardCharsets.UTF_8)));
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
        return signedJWT.serialize();
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
            });
        }
        return stringJoiner.toString();
    }
}
