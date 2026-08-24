package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.response.RoleResponse;

import java.util.List;

public interface IRoleService {
    List<RoleResponse> getAllRoles();
}
