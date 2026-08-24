package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.RoleResponse;
import quyet.electronic_commerce.service.IRoleService;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/roles")
public class RoleController {
    IRoleService roleService;

    @Operation(summary = "get all roles", description = "API get all roles")
    @GetMapping
    APIResponse<List<RoleResponse>> getAllRoles() {
        return APIResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }
}
