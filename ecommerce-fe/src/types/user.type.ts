export interface UserCreationRequest {
    username: string;
    password: string;
    fullName?: string;
    email?: string;
}

export interface UserResponse {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone?: string;
    roles?: string[];
}

export interface UserUpdateRequest {
    fullName?: string;
    email?: string;
    phone?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface UserRoleRequest {
    roles: string[];
}

export interface UserRoleResponse {
    userId: string;
    userName: string;
    roles: string[];
}
