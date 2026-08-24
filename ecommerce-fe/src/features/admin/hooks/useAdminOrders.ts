import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

export const useAdminOrders = () => {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: () => orderService.getAllAdmin(),
    });
};
