package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.ReviewRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ReviewResponse;
import quyet.electronic_commerce.service.IReviewService;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {

    IReviewService reviewService;

    @Operation(summary = "Thêm đánh giá sản phẩm")
    @PostMapping
    public APIResponse<ReviewResponse> createReview(@RequestBody @Valid ReviewRequest request) {
        return APIResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @Operation(summary = "Lấy danh sách đánh giá của sản phẩm")
    @GetMapping
    public APIResponse<PageResponse<ReviewResponse>> getReviewsByProduct(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return APIResponse.<PageResponse<ReviewResponse>>builder()
                .result(reviewService.getReviewsByProduct(productId, page, size))
                .build();
    }
}
