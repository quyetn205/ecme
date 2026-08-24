package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import quyet.electronic_commerce.dto.request.ReviewRequest;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ReviewResponse;
import quyet.electronic_commerce.entity.Product;
import quyet.electronic_commerce.entity.Review;
import quyet.electronic_commerce.entity.User;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.repository.ReviewRepository;
import quyet.electronic_commerce.repository.UserRepository;
import quyet.electronic_commerce.service.IReviewService;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class ReviewService implements IReviewService {

    ReviewRepository reviewRepository;
    ProductRepository productRepository;
    UserRepository userRepository;

    @PreAuthorize("isAuthenticated()")
    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new AppException(ErrorCode.REVIEW_EXISTED);
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    @Override
    public PageResponse<ReviewResponse> getReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .content(content)
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .fullName(review.getUser().getFullName())
                .build();
    }
}
