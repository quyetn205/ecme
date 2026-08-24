import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productService } from '@/services';
import { ProductFilterParams } from '@/types';

const QUERY_KEY = 'products';

export function useProducts(params: ProductFilterParams) {
    return useQuery({
        queryKey: [QUERY_KEY, params],
        queryFn: () => productService.getAll(params),
        placeholderData: keepPreviousData
    });
}
