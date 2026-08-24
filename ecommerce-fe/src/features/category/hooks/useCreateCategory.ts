import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryService } from '@/services';
import { CategoryRequest } from '@/types';
import { CATEGORY_QUERY_KEY } from './useCategories';

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CategoryRequest) => categoryService.create(data),
        onSuccess: () => {
            toast.success('Thêm danh mục thành công');
            queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        }
    });
}
