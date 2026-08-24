import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryService } from '@/services';
import { CATEGORY_QUERY_KEY } from './useCategories';

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => categoryService.delete(id),
        onSuccess: () => {
            toast.success('Xóa danh mục thành công');
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        }
    });
}
