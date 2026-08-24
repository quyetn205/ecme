package quyet.electronic_commerce.service;

import quyet.electronic_commerce.dto.request.CategoryRequest;
import quyet.electronic_commerce.dto.response.CategoryResponse;

import java.util.List;

public interface ICategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}
