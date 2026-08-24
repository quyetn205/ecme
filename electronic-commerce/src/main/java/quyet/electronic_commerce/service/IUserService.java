package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.ChangePasswordRequest;
import quyet.electronic_commerce.dto.request.UserRoleRequest;
import quyet.electronic_commerce.dto.response.UserResponse;
import quyet.electronic_commerce.dto.request.UserCreationRequest;
import quyet.electronic_commerce.dto.request.UserLoginRequest;
import quyet.electronic_commerce.dto.request.UserUpdateRequest;
import quyet.electronic_commerce.dto.response.UserRoleResponse;

import java.util.List;

public interface IUserService {
    UserResponse createUser(UserCreationRequest request);
//    void login(UserLoginRequest request);
    UserResponse getUser();
    UserRoleResponse assignRoles(Long userId, UserRoleRequest request);
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse changePassword(ChangePasswordRequest request);
    List<UserResponse> getAllUsers();
}
