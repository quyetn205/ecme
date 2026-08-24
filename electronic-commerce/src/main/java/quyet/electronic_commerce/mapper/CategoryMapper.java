package quyet.electronic_commerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import quyet.electronic_commerce.dto.request.CategoryRequest;
import quyet.electronic_commerce.dto.response.CategoryResponse;
import quyet.electronic_commerce.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);
    CategoryResponse toResponse(Category category);
    void updateCategory(CategoryRequest request, @MappingTarget Category category);
}
