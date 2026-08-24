import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { cartService } from '@/services';
import { useCartStore } from '@/stores';
import { CartItemRequest } from '@/types';

export function useAddToCart() {
    const queryClient = useQueryClient();
    const addItem = useCartStore((state) => state.addItem);

    return useMutation({
        mutationFn: (data: CartItemRequest) => cartService.addToCart(data),
        onSuccess: (data) => {
            // Update local store so UI reflects immediately
            if (data.result) {
                addItem(data.result);
            }
            // Refresh server cart data in background
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Đã thêm vào giỏ hàng');
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Không thể thêm vào giỏ hàng');
        }
    });
}
