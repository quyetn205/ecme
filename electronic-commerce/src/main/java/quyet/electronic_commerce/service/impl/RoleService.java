package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import quyet.electronic_commerce.dto.response.RoleResponse;
import quyet.electronic_commerce.mapper.RoleMapper;
import quyet.electronic_commerce.repository.RoleRepository;
import quyet.electronic_commerce.service.IRoleService;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class RoleService implements IRoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }
}
