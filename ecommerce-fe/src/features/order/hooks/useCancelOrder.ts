import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services';
import { OrderResponse } from '@/types';

const QUERY_KEY = 'orders';

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation<OrderResponse, Error, number>({
        mutationFn: async (id) => {
            const response = await orderService.cancel(id);
            return response.result;
        },
        onSuccess: () => {
            // Refresh danh sách + chi tiết đơn
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
}
