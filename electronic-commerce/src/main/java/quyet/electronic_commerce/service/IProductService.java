package quyet.electronic_commerce.service;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import quyet.electronic_commerce.dto.request.ProductRequest;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ProductResponse;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    ProductResponse createProduct(ProductRequest request) throws IOException;
    ProductResponse getProductById(Long id);
    PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir, String keyword, Long categoryId, Float minPrice, Float maxPrice);
ProductResponse updateProduct(Long id, ProductRequest request) throws IOException;
    ProductResponse deleteProduct(Long id);
}
