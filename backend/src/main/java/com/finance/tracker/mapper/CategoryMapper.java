package com.finance.tracker.mapper;

import com.finance.tracker.dto.CategoryDTO;
import com.finance.tracker.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryDTO toDTO(Category category) {
        if (category == null) return null;
        return CategoryDTO.builder()
                .id(category.getId())
                .userId(category.getUserId())
                .parentCategoryId(category.getParentCategoryId())
                .name(category.getName())
                .nameVn(category.getNameVn())
                .type(category.getType())
                .icon(category.getIcon())
                .colorHex(category.getColorHex())
                .isActive(category.getIsActive())
                .sortOrder(category.getSortOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) return null;
        return Category.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .parentCategoryId(dto.getParentCategoryId())
                .name(dto.getName())
                .nameVn(dto.getNameVn())
                .type(dto.getType())
                .icon(dto.getIcon())
                .colorHex(dto.getColorHex())
                .isActive(dto.getIsActive())
                .sortOrder(dto.getSortOrder())
                .build();
    }
}
