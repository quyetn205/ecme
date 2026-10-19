import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import {
    APIResponse,
    PageResponse,
    ProductResponse,
    ProductRequest,
    ProductFilterParams
} from '@/types';

export const productService = {
    getAll: async (params?: ProductFilterParams) => {
        const response = await httpClient.get<
            APIResponse<PageResponse<ProductResponse>>
        >(API_ENDPOINT.PRODUCT.BASE, { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await httpClient.get<APIResponse<ProductResponse>>(
            API_ENDPOINT.PRODUCT.BY_ID(id)
        );
        return response.data;
    },

    create: async (data: ProductRequest) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('price', String(data.price));
        formData.append('quantity', String(data.quantity));
        if (data.categoryId) formData.append('categoryId', String(data.categoryId));
        if (data.image) formData.append('image', data.image);

        const response = await httpClient.post<APIResponse<ProductResponse>>(
            API_ENDPOINT.PRODUCT.BASE,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return response.data;
    },

    update: async (id: number, data: ProductRequest) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('price', String(data.price));
        formData.append('quantity', String(data.quantity));
        if (data.categoryId) formData.append('categoryId', String(data.categoryId));
        if (data.image) formData.append('image', data.image);

        const response = await httpClient.put<APIResponse<ProductResponse>>(
            API_ENDPOINT.PRODUCT.BY_ID(id),
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return response.data;
    },


    delete: async (id: number) => {
        const response = await httpClient.delete<APIResponse<ProductResponse>>(
            API_ENDPOINT.PRODUCT.BY_ID(id)
        );
        return response.data;
    }
};
