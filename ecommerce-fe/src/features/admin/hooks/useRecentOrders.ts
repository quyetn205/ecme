import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { APIResponse, OrderResponse } from '@/types';

export const useRecentOrders = () => {
    return useQuery({
        queryKey: ['dashboard-recent-orders'],
        queryFn: async () => {
            const res = await httpClient.get<APIResponse<OrderResponse[]>>(
                '/dashboard/recent-orders'
            );
            return res.data.result;
        }
    });
};
