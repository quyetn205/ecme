import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import { APIResponse, CategoryRequest, CategoryResponse } from '@/types';

export const categoryService = {
    getAll: async () => {
        const response = await httpClient.get<APIResponse<CategoryResponse[]>>(
            API_ENDPOINT.CATEGORY.BASE
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await httpClient.get<APIResponse<CategoryResponse>>(
            API_ENDPOINT.CATEGORY.BY_ID(id)
        );
        return response.data;
    },

    create: async (data: CategoryRequest) => {
        const response = await httpClient.post<APIResponse<CategoryResponse>>(
            API_ENDPOINT.CATEGORY.BASE,
            data
        );
        return response.data;
    },

    update: async (id: number, data: CategoryRequest) => {
        const response = await httpClient.put<APIResponse<CategoryResponse>>(
            API_ENDPOINT.CATEGORY.BY_ID(id),
            data
        );
        return response.data;
    },

    delete: async (id: number) => {
        const response = await httpClient.delete<APIResponse<void>>(
            API_ENDPOINT.CATEGORY.BY_ID(id)
        );
        return response.data;
    }
};
