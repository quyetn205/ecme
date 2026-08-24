import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/features/product/api/review.api';

export const useProductReviews = (
    productId: number,
    page: number = 1,
    size: number = 10
) => {
    return useQuery({
        queryKey: ['reviews', productId, page, size],
        queryFn: async () => {
            const res = await reviewApi.getReviewsByProduct(productId, page, size);
            return res.result;
        },
        enabled: !!productId
    });
};
