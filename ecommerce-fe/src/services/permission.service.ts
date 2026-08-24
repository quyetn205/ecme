import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import { APIResponse, PermissionRequest, PermissionResponse } from '@/types';

export const permissionService = {
    getAll: async () => {
        const response = await httpClient.get<
            APIResponse<PermissionResponse[]>
        >(API_ENDPOINT.PERMISSION.BASE);
        return response.data;
    },

    create: async (data: PermissionRequest) => {
        const response = await httpClient.post<APIResponse<PermissionResponse>>(
            API_ENDPOINT.PERMISSION.BASE,
            data
        );
        return response.data;
    },

    delete: async (name: string) => {
        const response = await httpClient.delete<
            APIResponse<PermissionResponse>
        >(API_ENDPOINT.PERMISSION.BY_NAME(name));
        return response.data;
    }
};
