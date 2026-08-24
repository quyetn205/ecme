package quyet.electronic_commerce.mapper;

import org.mapstruct.*;
import quyet.electronic_commerce.dto.request.RoleRequest;
import quyet.electronic_commerce.dto.response.RoleResponse;
import quyet.electronic_commerce.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);
}
