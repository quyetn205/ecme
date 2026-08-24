import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/features/product/api/review.api';
import { ReviewRequest } from '@/types/review.type';
import toast from 'react-hot-toast';

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ReviewRequest) => {
            const res = await reviewApi.createReview(data);
            return res.result;
        },
        onSuccess: (_, variables) => {
            toast.success('Đánh giá sản phẩm thành công!');
            queryClient.invalidateQueries({
                queryKey: ['reviews', variables.productId]
            });
            queryClient.invalidateQueries({
                queryKey: ['product', variables.productId]
            });
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Có lỗi xảy ra khi đánh giá.'
            );
        }
    });
};
