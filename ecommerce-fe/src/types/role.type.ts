export interface RoleRequest {
    name: string;
    description?: string;
    permissions: string[];
}

export interface PermissionResponse {
    name: string;
    description: string;
}

export interface RoleResponse {
    name: string;
    description: string;
    permissions: PermissionResponse[];
}

export interface PermissionRequest {
    name: string;
    description?: string;
}
