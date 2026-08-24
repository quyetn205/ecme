package quyet.electronic_commerce.service.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quyet.electronic_commerce.dto.request.CategoryRequest;
import quyet.electronic_commerce.dto.response.CategoryResponse;
import quyet.electronic_commerce.entity.Category;
import quyet.electronic_commerce.exception.AppException;
import quyet.electronic_commerce.exception.ErrorCode;
import quyet.electronic_commerce.mapper.CategoryMapper;
import quyet.electronic_commerce.repository.CategoryRepository;
import quyet.electronic_commerce.repository.ProductRepository;
import quyet.electronic_commerce.service.ICategoryService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService implements ICategoryService {
    CategoryRepository categoryRepository;
    ProductRepository productRepository;
    CategoryMapper categoryMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        Category category = categoryMapper.toCategory(request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Cacheable(value = "categories")
    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Cacheable(value = "category", key = "#id")
    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        return categoryMapper.toResponse(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "category", key = "#id")
    })
    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        
        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        categoryMapper.updateCategory(request, category);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "category", key = "#id")
    })
    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        
        if (productRepository.existsByCategory(category)) {
            throw new AppException(ErrorCode.CATEGORY_IN_USE);
        }
        
        categoryRepository.delete(category);
    }
}
