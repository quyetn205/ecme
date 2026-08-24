import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { cartService } from '@/services';
import { useCartStore } from '@/stores';

export function useUpdateQuantity() {
    const queryClient = useQueryClient();
    const updateItemQuantity = useCartStore(
        (state) => state.updateItemQuantity
    );
    const setItems = useCartStore((state) => state.setItems);

    return useMutation({
        mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
            cartService.updateQuantity(id, { quantity }),
        onSuccess: (data, variables) => {
            const { id, quantity } = variables;

            // Backend returns null when quantity <= 0 → item deleted
            if (data.result === null || data.result === undefined) {
                // Remove item from local store
                updateItemQuantity(id, 0);
            } else {
                // Update quantity in local store
                setItems(
                    useCartStore
                        .getState()
                        .items.map((item) =>
                            item.id === id
                                ? { ...item, quantity: data.result!.quantity }
                                : item
                        )
                );
            }
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Không thể cập nhật số lượng');
        }
    });
}
