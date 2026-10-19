package quyet.electronic_commerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_EXISTED(1001,"User existed",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002,"USERNAME must be least 4 characters",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003,"PASSWORD must be least 4 characters",HttpStatus.BAD_REQUEST),
    INVALID_KEY(1004, "Uncategorized error", HttpStatus.BAD_REQUEST),
    LOGIN_INVALID(1001,"login invalid",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "unauthenticated", HttpStatus.UNAUTHORIZED),
    PRODUCT_EXISTED(1007, "product existed", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_EXISTED(1008, "product not existed", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1009, "role not existed", HttpStatus.BAD_REQUEST),
    ROLE_EXISTED(1010, "role existed", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED(1011, "permission existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_EXISTED(1012, "permission not existed", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_ADMIN_ROLE(1013, "cannot delete admin role", HttpStatus.BAD_REQUEST),
    ACCOUNT_DISABLED(1014, "account disabled", HttpStatus.BAD_REQUEST),
    OUT_OF_STOCK(1015, "out of stock", HttpStatus.BAD_REQUEST),
    NOT_PRODUCT_EXISTED(1016, "not product existed", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1017, "unauthorized", HttpStatus.FORBIDDEN),
    CART_EMPTY(1018, "cart empty", HttpStatus.BAD_REQUEST),
    ORDER_NOT_EXISTED(1019, "order not existed", HttpStatus.BAD_REQUEST),
    NO(1020, "no", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL(1021, "order can not be cancelled", HttpStatus.BAD_REQUEST),
    PASSWORD_INCORRECT(1022, "password incorrect", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1024, "category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1025, "category not existed", HttpStatus.BAD_REQUEST),
    CATEGORY_IN_USE(1026, "cannot delete category in use", HttpStatus.BAD_REQUEST),
    INVALID_PRICE_RANGE(1027, "minPrice cannot be greater than maxPrice", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1023, "email existed", HttpStatus.BAD_REQUEST),
    REVIEW_EXISTED(1028, "review existed", HttpStatus.BAD_REQUEST);

    ErrorCode(int code,String message,HttpStatus httpStatus){
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;


}
