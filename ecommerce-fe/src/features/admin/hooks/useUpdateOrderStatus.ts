import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { toast } from 'react-hot-toast';

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => 
            orderService.updateStatus(id, status),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công');
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    });
};
