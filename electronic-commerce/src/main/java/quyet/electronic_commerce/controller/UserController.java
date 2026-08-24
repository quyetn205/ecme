package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.ChangePasswordRequest;
import quyet.electronic_commerce.dto.request.UserRoleRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.UserResponse;
import quyet.electronic_commerce.dto.request.UserCreationRequest;
import quyet.electronic_commerce.dto.request.UserUpdateRequest;
import quyet.electronic_commerce.dto.response.UserRoleResponse;
import quyet.electronic_commerce.service.IUserService;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@RequestMapping("/users")
public class UserController {
    IUserService userService;

    @Operation(summary = "Add user",description = "API create new user")
    @PostMapping("/register")
    APIResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request){
        log.info("Controller:UserCreationRequest");
        return APIResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @Operation(summary = "Get user info",description = "API get user info")
    @GetMapping("/me")
    APIResponse<UserResponse> me(){
        return APIResponse.<UserResponse>builder()
                .result(userService.getUser())
                .build();
    }

@Operation(summary = "Assign roles to user",description = "API assign roles to user")
    @PutMapping("/{userId}/roles")
    APIResponse<UserRoleResponse> assignRoles(
            @PathVariable Long userId,
            @Valid @RequestBody UserRoleRequest request){
        return APIResponse.<UserRoleResponse>builder()
                .result(userService.assignRoles(userId,request))
                .build();
    }

    @Operation(summary = "Update user profile",description = "API update current user profile")
    @PutMapping("/me")
    APIResponse<UserResponse> updateProfile(@Valid @RequestBody UserUpdateRequest request){
        return APIResponse.<UserResponse>builder()
                .result(userService.updateProfile(request))
                .build();
    }

@Operation(summary = "Change password",description = "API change current user password")
    @PutMapping("/me/password")
    APIResponse<UserResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request){
        return APIResponse.<UserResponse>builder()
                .result(userService.changePassword(request))
                .build();
    }

    @Operation(summary = "Get all users",description = "API get all users (ADMIN only)")
    @GetMapping
    APIResponse<java.util.List<UserResponse>> getAllUsers(){
        return APIResponse.<java.util.List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }



//    @PostMapping("/login")
//    public APIResponse<UserResponse> login(@RequestBody @Valid UserLoginRequest request){
//        userService.login(request);
//        return APIResponse.<UserResponse>builder()
//                .message("Đăng nhập thành công")
//                .build();
//    }

//    @GetMapping("/me")
//    public APIResponse<UserResponse> me(@RequestBody){
//        log.info("Controller:get info");
//        userService.getInfor()
//    }
}
