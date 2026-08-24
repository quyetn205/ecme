package quyet.electronic_commerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import quyet.electronic_commerce.dto.response.UserResponse;
import quyet.electronic_commerce.dto.request.UserCreationRequest;
import quyet.electronic_commerce.dto.response.UserRoleResponse;
import quyet.electronic_commerce.entity.Role;
import quyet.electronic_commerce.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
@Mapping(target = "roles", expression = "java(roleNames(user.getRoles()))")
    UserResponse toResponse(User user);
    @Mapping(target = "roles", expression = "java(roleNames(user.getRoles()))")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.username")
    UserRoleResponse toUserRoleResponse(User user);

    default Set<String> roleNames(Set<Role> roles) {
        if (roles == null) {
            return Set.of();
        }
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}
