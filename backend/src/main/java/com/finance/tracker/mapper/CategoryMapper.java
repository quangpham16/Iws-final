package com.finance.tracker.mapper;

import com.finance.tracker.dto.CategoryDTO;
import com.finance.tracker.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryDTO toDTO(Category category) {
        if (category == null) return null;
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setType(category.getType() != null ? category.getType().name() : null);
        dto.setIcon(category.getIcon());
        dto.setColorHex(category.getColorHex());
        dto.setIsSystem(category.getIsSystem());
        dto.setCreatedAt(category.getCreatedAt());
        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) return null;
        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getType() != null) {
            category.setType(Category.CategoryType.valueOf(dto.getType()));
        }
        category.setIcon(dto.getIcon());
        category.setColorHex(dto.getColorHex());
        return category;
    }
}
