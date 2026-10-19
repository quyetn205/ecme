import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services';

const QUERY_KEY = 'cart';

export function useCart(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => cartService.getCartItems(),
        staleTime: 30 * 1000, // 30s — cart data changes frequently
        ...options
    });
}
