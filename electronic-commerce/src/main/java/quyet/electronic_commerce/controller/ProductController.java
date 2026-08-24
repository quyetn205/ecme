package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.ProductRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.PageResponse;
import quyet.electronic_commerce.dto.response.ProductResponse;
import quyet.electronic_commerce.service.IProductService;
import quyet.electronic_commerce.service.impl.ProductService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
@RequestMapping("/products")
public class ProductController {
    IProductService productService;

    @Operation(summary = "Create product",description = "API create new product")
    @PostMapping()
    APIResponse<ProductResponse> createProduct(@Valid @ModelAttribute ProductRequest request) throws IOException {
        return APIResponse.<ProductResponse>builder()
                .result(productService.createProduct(request))
                .build();
    }

    @Operation(summary = "Get product by id",description = "API get product by id")
    @GetMapping("/{id}")
    APIResponse<ProductResponse> getProduct(@PathVariable Long id){
        return APIResponse.<ProductResponse>builder()
                .result(productService.getProductById(id))
                .build();
    }

    @Operation(summary = "Get all products",description = "API get all products with pagination and sorting")
    @GetMapping
    APIResponse<PageResponse<ProductResponse>> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "5") int size,
                                                              @RequestParam(defaultValue = "id") String sortBy,
                                                              @RequestParam(defaultValue = "asc") String sortDir,
                                                              @RequestParam(required = false) String keyword,
                                                              @RequestParam(required = false) Long categoryId,
                                                              @RequestParam(required = false) Float minPrice,
                                                              @RequestParam(required = false) Float maxPrice){
        return APIResponse.<PageResponse<ProductResponse>>builder()
                .result(productService.getAllProducts(page,size,sortBy,sortDir, keyword, categoryId, minPrice, maxPrice))
                .build();
    }

@Operation(summary = "Update product",description = "API update product by id")
    @PutMapping("/{id}")
    APIResponse<ProductResponse> updateProduct(@PathVariable Long id, @Valid @ModelAttribute ProductRequest request) throws IOException {
        return APIResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id, request))
                .build();
    }

    @Operation(summary = "Delete product",description = "API delete product by id")
    @DeleteMapping("/{id}")
    APIResponse<ProductResponse> deleteProduct(@PathVariable Long id){
        return APIResponse.<ProductResponse>builder()
                .message("delete product successfully")
                .result(productService.deleteProduct(id))
                .build();
    }
}
