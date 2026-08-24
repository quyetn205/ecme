import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productService } from '@/services';
import { ProductRequest } from '@/types';

const QUERY_KEY = 'products';

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductRequest) => productService.create(data),
        onSuccess: () => {
            toast.success('Thêm sản phẩm thành công');
            // Invalidate list queries to refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Thêm sản phẩm thất bại');
        }
    });
}
