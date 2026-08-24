import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { OrderResponse } from '@/types';

const QUERY_KEY = 'orders';

export function useOrder(id: number) {
    return useQuery<OrderResponse>({
        queryKey: [QUERY_KEY, id],
        queryFn: async () => {
            const response = await orderService.getById(id);
            return response.result;
        },
        enabled: !!id
    });
}
