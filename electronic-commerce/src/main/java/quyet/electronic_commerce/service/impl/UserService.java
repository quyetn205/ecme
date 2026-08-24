package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import quyet.electronic_commerce.dto.request.ChangePasswordRequest;
import quyet.electronic_commerce.dto.request.UserRoleRequest;
import quyet.electronic_commerce.dto.response.UserResponse;
import quyet.electronic_commerce.dto.request.UserCreationRequest;
import quyet.electronic_commerce.dto.request.UserUpdateRequest;
import quyet.electronic_commerce.dto.response.UserRoleResponse;
import quyet.electronic_commerce.entity.Role;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.enums.RoleEnum;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.mapper.UserMapper;
import quyet.electronic_commerce.repository.RoleRepository;
import quyet.electronic_commerce.repository.UserRepository;
import quyet.electronic_commerce.service.IUserService;

import java.util.HashSet;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Service
public class UserService implements IUserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        log.info("Service:create user");
        if(userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(true);
        //phan quyen user cho nguoi dung
        HashSet<Role> roles = new HashSet<>();
        roles.add(roleRepository.findById(RoleEnum.USER.name())
                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_EXISTED)));
        user.setRoles(roles);
//        HashSet<>
//        user.setRoles();
        return userMapper.toResponse(userRepository.save(user));
    }

//    @Override
//    public void login(UserLoginRequest request) {
//        User user=userRepository.findByUsername(request.getUsername()).orElseThrow();
//        if(passwordEncoder.matches(request.getPassword(),user.getPassword())){
//            log.info("Service:login user");
//        }else {
//            throw new AppException(ErrorCode.LOGIN_INVALID);
//        }
//    }

    @Override
    public UserResponse getUser() {
        var context= SecurityContextHolder.getContext();
        String name =context.getAuthentication().getName();

        User user=userRepository.findByUsername(name)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public UserRoleResponse assignRoles(Long userId, UserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User currentUser = getCurrentUser();
        if (user.getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        boolean isTargetAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(RoleEnum.ADMIN.name()));
        boolean isRequestAdmin = request.getRoles().contains(RoleEnum.ADMIN.name());

        if (isTargetAdmin && !isRequestAdmin) {
            throw new AppException(ErrorCode.CANNOT_DELETE_ADMIN_ROLE);
        }

        var roles = roleRepository.findAllById(request.getRoles());
        if (roles.size() != request.getRoles().size()) {
            throw new AppException(ErrorCode.ROLE_NOT_EXISTED);
        }

        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserRoleResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateProfile(UserUpdateRequest request) {
        User user = getCurrentUser();
        // Kiểm tra email có bị user khác dùng hay không
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        boolean matches = passwordEncoder.matches(request.getOldPassword(), user.getPassword());
        if (!matches) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userMapper.toResponse(userRepository.save(user));
    }

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        return userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }
}
