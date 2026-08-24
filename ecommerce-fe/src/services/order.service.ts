import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import { APIResponse, OrderRequest, OrderResponse } from '@/types';

export const orderService = {
    create: async (data: OrderRequest) => {
        const response = await httpClient.post<APIResponse<OrderResponse>>(
            API_ENDPOINT.ORDER.BASE,
            data
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await httpClient.get<APIResponse<OrderResponse>>(
            API_ENDPOINT.ORDER.BY_ID(id)
        );
        return response.data;
    },

    getAll: async () => {
        const response = await httpClient.get<APIResponse<OrderResponse[]>>(
            API_ENDPOINT.ORDER.BASE
        );
        return response.data;
    },

    cancel: async (id: number) => {
        const response = await httpClient.patch<APIResponse<OrderResponse>>(
            API_ENDPOINT.ORDER.CANCEL(id)
        );
        return response.data;
    },

    getAllAdmin: async () => {
        const response = await httpClient.get<APIResponse<OrderResponse[]>>(
            `${API_ENDPOINT.ORDER.BASE}/admin`
        );
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await httpClient.patch<APIResponse<OrderResponse>>(
            `${API_ENDPOINT.ORDER.BASE}/${id}/status?status=${status}`
        );
        return response.data;
    }
};
