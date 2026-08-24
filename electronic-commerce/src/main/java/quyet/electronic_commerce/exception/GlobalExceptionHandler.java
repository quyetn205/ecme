package quyet.electronic_commerce.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import quyet.electronic_commerce.dto.response.APIResponse;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler{

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse> handleAppException(AppException exception){
        ErrorCode errorCode = exception.getErrorCode();
        APIResponse response = new APIResponse();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<APIResponse> handleException(Exception exception){
        log.error("Unhandled exception:",exception);
        APIResponse response = new APIResponse();
        response.setCode(500);
        response.setMessage("Internal Server Error");
        return ResponseEntity.internalServerError().body(response);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<APIResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception){
        ErrorCode errorCode=ErrorCode.INVALID_KEY;
        try {
            String defaultMessage = exception.getBindingResult().getFieldError().getDefaultMessage();
            if (defaultMessage != null) {
                errorCode = ErrorCode.valueOf(defaultMessage);
            }
        } catch (IllegalArgumentException e){
            // Ignore, fallback to INVALID_KEY
        }

        java.util.Map<String, String> fieldErrors = new java.util.HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        });

        APIResponse<java.util.Map<String, String>> response = new APIResponse<>();
        response.setCode(errorCode.getCode());
        if (errorCode == ErrorCode.INVALID_KEY && !fieldErrors.isEmpty()) {
            response.setMessage("Validation failed");
        } else {
            response.setMessage(errorCode.getMessage());
        }
        response.setResult(fieldErrors);

        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }
}
