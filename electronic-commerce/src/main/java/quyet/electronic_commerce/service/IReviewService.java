package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.ReviewRequest;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ReviewResponse;

public interface IReviewService {
    ReviewResponse createReview(ReviewRequest request);
    PageResponse<ReviewResponse> getReviewsByProduct(Long productId, int page, int size);
}
