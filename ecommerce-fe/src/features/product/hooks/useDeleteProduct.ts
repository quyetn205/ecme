import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productService } from '@/services';

const QUERY_KEY = 'products';
const SINGLE_KEY = 'product';

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            toast.success('Xóa sản phẩm thành công');
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [SINGLE_KEY] });
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Xóa sản phẩm thất bại');
        }
    });
}
