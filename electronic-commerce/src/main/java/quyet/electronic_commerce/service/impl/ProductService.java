package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quyet.electronic_commerce.dto.request.ProductRequest;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ProductResponse;
import quyet.electronic_commerce.entity.Category;
import quyet.electronic_commerce.entity.Product;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.mapper.ProductMapper;
import quyet.electronic_commerce.repository.CategoryRepository;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.repository.ReviewRepository;
import quyet.electronic_commerce.service.IProductService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@Service
public class ProductService implements IProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;
    ReviewRepository reviewRepository;

    String uploadDir="uploads/";

    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Override
    public ProductResponse createProduct(ProductRequest request) throws IOException {
        String imageUrl = null;
        if(request.getImage()!=null&& !request.getImage().isEmpty()){
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + request.getImage().getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, request.getImage().getBytes());
            imageUrl = "http://localhost:8081/uploads/" + fileName;

        }
        if(productRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }
        
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        }
        
        Product product=productMapper.toProduct(request);
        product.setImage(imageUrl);
        product.setCategory(category);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Cacheable(value = "product", key = "#id")
    @Override
    public ProductResponse getProductById(Long id) {
        log.info("Service:get product");
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        ProductResponse response = productMapper.toResponse(product);
        response.setAverageRating(reviewRepository.calculateAverageRating(id));
        response.setReviewCount(reviewRepository.countByProductId(id));
        return response;
    }

    @Override
    public PageResponse<ProductResponse> getAllProducts(int page, int size,String sortBy, String sortDir, String keyword, Long categoryId, Float minPrice, Float maxPrice) {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new AppException(ErrorCode.INVALID_PRICE_RANGE);
        }
        if (minPrice != null && minPrice < 0) {
            minPrice = 0f;
        }
        if (maxPrice != null && maxPrice < 0) {
            maxPrice = 0f;
        }

        Sort sort=sortDir.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();
        Pageable pageable= PageRequest.of(page,size,sort);
        
        // If categoryId is present, validate it exists
        if (categoryId != null && !categoryRepository.existsById(categoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }

        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.isEmpty()) {
                keyword = null;
            }
        }

        Page<Product> productPage = productRepository.findWithFilters(keyword, categoryId, minPrice, maxPrice, pageable);
        
        System.out.println(productPage.getTotalPages());
        return productMapper.toPageResponse(productPage);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Transactional
    @CacheEvict(value = "product", key = "#id")
    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) throws IOException {
        Product product=productRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        if(request.getImage()!=null && !request.getImage().isEmpty()){
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + request.getImage().getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, request.getImage().getBytes());
            product.setImage("http://localhost:8081/uploads/" + fileName);
        }
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            product.setCategory(category);
        }

        productMapper.updateProduct(request,product);
        return productMapper.toResponse(productRepository.save(product));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "product", key = "#id")
    @Override
    public ProductResponse deleteProduct(Long id) {
        if(productRepository.existsById(id)){
            Product product=productRepository.deleteProductById(id);
            return productMapper.toResponse(product);
        }else {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
    }
}
