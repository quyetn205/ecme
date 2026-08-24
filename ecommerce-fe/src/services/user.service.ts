import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import {
    APIResponse,
    UserCreationRequest,
    UserResponse,
    UserRoleRequest,
    UserRoleResponse,
    UserUpdateRequest,
    ChangePasswordRequest
} from '@/types';

export const userService = {
    register: async (data: UserCreationRequest) => {
        const response = await httpClient.post<APIResponse<UserResponse>>(
            API_ENDPOINT.USER.REGISTER,
            data
        );
        return response.data;
    },

    getMe: async () => {
        const response = await httpClient.get<APIResponse<UserResponse>>(
            API_ENDPOINT.USER.ME
        );
        return response.data;
    },

    getAll: async () => {
        const response = await httpClient.get<APIResponse<UserResponse[]>>(
            API_ENDPOINT.USER.GET_ALL
        );
        return response.data;
    },

    assignRoles: async (userId: number, data: UserRoleRequest) => {
        const response = await httpClient.put<APIResponse<UserRoleResponse>>(
            API_ENDPOINT.USER.ROLES(userId),
            data
        );
        return response.data;
    },

    updateProfile: async (data: UserUpdateRequest) => {
        const response = await httpClient.put<APIResponse<UserResponse>>(
            API_ENDPOINT.USER.UPDATE_ME,
            data
        );
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest) => {
        const response = await httpClient.put<APIResponse<UserResponse>>(
            API_ENDPOINT.USER.CHANGE_PASSWORD,
            data
        );
        return response.data;
    }
};
