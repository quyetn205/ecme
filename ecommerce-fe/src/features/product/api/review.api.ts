import { httpClient } from '@/services/http-client';
import { APIResponse, PageResponse } from '@/types';
import { ReviewRequest, ReviewResponse } from '@/types/review.type';

export const reviewApi = {
    getReviewsByProduct: async (
        productId: number,
        page: number = 1,
        size: number = 10
    ) => {
        const response = await httpClient.get<
            APIResponse<PageResponse<ReviewResponse>>
        >('/reviews', {
            params: { productId, page, size }
        });
        return response.data;
    },

    createReview: async (data: ReviewRequest) => {
        const response = await httpClient.post<APIResponse<ReviewResponse>>(
            '/reviews',
            data
        );
        return response.data;
    }
};
