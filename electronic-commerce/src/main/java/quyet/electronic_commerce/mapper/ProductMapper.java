package quyet.electronic_commerce.mapper;

import org.mapstruct.*;
import org.springframework.data.domain.Page;
import quyet.electronic_commerce.dto.request.ProductRequest;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ProductResponse;
import quyet.electronic_commerce.entity.Product;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    @Mapping(target = "stockQuantity",source = "quantity")
    @Mapping(target = "image",ignore = true)
    Product toProduct(ProductRequest request);
    @Mapping(target = "quantity",source = "stockQuantity")
    ProductResponse toResponse(Product product);
    @Mapping(target = "stockQuantity",source = "quantity")
    @Mapping(target = "image",ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProduct(ProductRequest request, @MappingTarget Product product);

    @AfterMapping
    default void calculateRating(Product product, @MappingTarget ProductResponse response) {
        if (product.getReviews() != null && !product.getReviews().isEmpty()) {
            int total = 0;
            for (quyet.electronic_commerce.entity.Review r : product.getReviews()) {
                total += r.getRating() != null ? r.getRating() : 0;
            }
            response.setReviewCount(product.getReviews().size());
            response.setAverageRating((float) total / product.getReviews().size());
        } else {
            response.setReviewCount(0);
            response.setAverageRating(0f);
        }
    }

    default PageResponse<ProductResponse> toPageResponse(Page<Product> page) {
        if (page == null) {
            return null;
        }
        List<ProductResponse> content = page.getContent().stream()
                .map(this::toResponse)
                .toList();
        return PageResponse.<ProductResponse>builder()
                .content(content)
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
