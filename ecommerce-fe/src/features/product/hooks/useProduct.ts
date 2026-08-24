import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';

const QUERY_KEY = 'product';

export function useProduct(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => productService.getById(id),
        enabled: !!id
    });
}
