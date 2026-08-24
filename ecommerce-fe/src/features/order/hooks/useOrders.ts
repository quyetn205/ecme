import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { OrderResponse } from '@/types';

const QUERY_KEY = 'orders';

export function useOrders() {
    return useQuery<OrderResponse[]>({
        queryKey: [QUERY_KEY],
        queryFn: async () => {
            const response = await orderService.getAll();
            return response.result;
        }
    });
}
