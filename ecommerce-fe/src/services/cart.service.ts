import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import {
    APIResponse,
    CartItemRequest,
    CartItemResponse,
    UpdateQuantityRequest
} from '@/types';

export const cartService = {
    addToCart: async (data: CartItemRequest) => {
        const response = await httpClient.post<APIResponse<CartItemResponse>>(
            API_ENDPOINT.CART.ADD,
            data
        );
        return response.data;
    },

    getCartItems: async () => {
        const response = await httpClient.get<APIResponse<CartItemResponse[]>>(
            API_ENDPOINT.CART.BASE
        );
        return response.data;
    },

    updateQuantity: async (id: number, data: UpdateQuantityRequest) => {
        const response = await httpClient.put<APIResponse<CartItemResponse>>(
            API_ENDPOINT.CART.ITEM(id),
            data
        );
        return response.data;
    },

    deleteCartItem: async (id: number) => {
        const response = await httpClient.delete<APIResponse<void>>(
            API_ENDPOINT.CART.ITEM(id)
        );
        return response.data;
    }
};

