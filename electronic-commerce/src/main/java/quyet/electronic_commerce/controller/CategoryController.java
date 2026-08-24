package quyet.electronic_commerce.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import quyet.electronic_commerce.dto.request.CategoryRequest;
import quyet.electronic_commerce.dto.response.APIResponse;
import quyet.electronic_commerce.dto.response.CategoryResponse;
import quyet.electronic_commerce.service.ICategoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/categories")
public class CategoryController {
    ICategoryService categoryService;

    @Operation(summary = "Create category", description = "API create new category (ADMIN only)")
    @PostMapping
    APIResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return APIResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @Operation(summary = "Get all categories", description = "API get all categories")
    @GetMapping
    APIResponse<List<CategoryResponse>> getAllCategories() {
        return APIResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategories())
                .build();
    }

    @Operation(summary = "Get category by id", description = "API get category by id")
    @GetMapping("/{id}")
    APIResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return APIResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoryById(id))
                .build();
    }

    @Operation(summary = "Update category", description = "API update category by id (ADMIN only)")
    @PutMapping("/{id}")
    APIResponse<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return APIResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id, request))
                .build();
    }

    @Operation(summary = "Delete category", description = "API delete category by id (ADMIN only)")
    @DeleteMapping("/{id}")
    APIResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return APIResponse.<Void>builder()
                .message("delete category successfully")
                .build();
    }
}
