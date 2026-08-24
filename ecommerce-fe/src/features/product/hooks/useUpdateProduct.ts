import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productService } from '@/services';
import { ProductRequest } from '@/types';

const QUERY_KEY = 'products';
const SINGLE_KEY = 'product';

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductRequest }) =>
            productService.update(id, data),
        onSuccess: (_, variables) => {
            toast.success('Cập nhật sản phẩm thành công');
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({
                queryKey: [SINGLE_KEY, variables.id]
            });
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Cập nhật sản phẩm thất bại');
        }
    });
}
