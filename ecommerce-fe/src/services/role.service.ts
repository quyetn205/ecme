import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import { APIResponse, RoleRequest, RoleResponse } from '@/types';

export const roleService = {
    getAll: async () => {
        const response = await httpClient.get<APIResponse<RoleResponse[]>>(
            API_ENDPOINT.ROLE.BASE
        );
        return response.data;
    },

    create: async (data: RoleRequest) => {
        const response = await httpClient.post<APIResponse<RoleResponse>>(
            API_ENDPOINT.ROLE.BASE,
            data
        );
        return response.data;
    },

    update: async (data: RoleRequest) => {
        const response = await httpClient.put<APIResponse<RoleResponse>>(
            API_ENDPOINT.ROLE.BASE,
            data
        );
        return response.data;
    },

    delete: async (roleName: string) => {
        const response = await httpClient.delete<APIResponse<void>>(
            API_ENDPOINT.ROLE.BY_NAME(roleName)
        );
        return response.data;
    }
};
