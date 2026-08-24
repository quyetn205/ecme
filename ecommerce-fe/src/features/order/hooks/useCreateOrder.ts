import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services';
import { OrderRequest, OrderResponse } from '@/types';

export function useCreateOrder() {
    return useMutation<OrderResponse, Error, OrderRequest>({
        mutationFn: async (data) => {
            const response = await orderService.create(data);
            return response.result;
        }
    });
}
