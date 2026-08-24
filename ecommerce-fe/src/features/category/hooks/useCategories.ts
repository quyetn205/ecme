import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services';

export const CATEGORY_QUERY_KEY = 'categories';

export function useCategories() {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEY],
        queryFn: () => categoryService.getAll()
    });
}
