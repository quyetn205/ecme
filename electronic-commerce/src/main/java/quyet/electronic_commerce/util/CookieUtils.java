package quyet.electronic_commerce.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    /**
     * Add refresh token as HttpOnly cookie.
     * HttpOnly = true  → JavaScript cannot read it (XSS-safe)
     * Secure   = false → works on HTTP during development (set true in production with HTTPS)
     * Path     = /auth → cookie only sent to /auth/** endpoints (minimizes exposure)
     */
    public static void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAgeSeconds) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set true when using HTTPS in production
        cookie.setPath("/auth");
        cookie.setMaxAge((int) maxAgeSeconds);
        response.addCookie(cookie);
    }

    /**
     * Clear the refresh token cookie by setting maxAge to 0.
     */
    public static void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    /**
     * Extract refresh token from cookies in the request.
     */
    public static String getRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
