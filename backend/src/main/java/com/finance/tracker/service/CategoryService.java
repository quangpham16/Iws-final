package com.finance.tracker.service;

import com.finance.tracker.dto.CategoryDTO;
import com.finance.tracker.mapper.CategoryMapper;
import com.finance.tracker.model.Category;
import com.finance.tracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories(Long userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO createCategory(Long userId, CategoryDTO dto) {
        if (dto.getColorHex() != null && !dto.getColorHex().isEmpty() && 
            categoryRepository.existsByUserIdAndColorHex(userId, dto.getColorHex())) {
            throw new RuntimeException("Color already exists for another category");
        }
        Category category = categoryMapper.toEntity(dto);
        category.setUserId(userId);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long userId, Long id, CategoryDTO dto) {
        System.out.println("[DEBUG] updateCategory called - userId: " + userId + ", id: " + id);
        System.out.println("[DEBUG] DTO: name=" + dto.getName() + ", type=" + dto.getType() + ", color=" + dto.getColorHex());
        
        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }
        if (id == null) {
            throw new RuntimeException("Category ID is required");
        }
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        System.out.println("[DEBUG] Found category: " + category.getName() + ", owner: " + category.getUserId());
        
        if (!category.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: user " + userId + " cannot modify category " + id);
        }
        
        if (dto.getColorHex() != null && !dto.getColorHex().isEmpty() && 
            !dto.getColorHex().equals(category.getColorHex()) &&
            categoryRepository.existsByUserIdAndColorHexAndIdNot(userId, dto.getColorHex(), id)) {
            throw new RuntimeException("Color already exists for another category");
        }
        
        category.setName(dto.getName());
        
        if (dto.getType() != null && !dto.getType().isEmpty()) {
            try {
                category.setType(Category.CategoryType.valueOf(dto.getType().toLowerCase()));
                System.out.println("[DEBUG] Set type to: " + dto.getType().toLowerCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid category type: " + dto.getType() + ". Must be: expense, income, or transfer");
            }
        }
        
        category.setColorHex(dto.getColorHex());
        System.out.println("[DEBUG] Set color to: " + dto.getColorHex());
        
        Category updated = categoryRepository.save(category);
        System.out.println("[DEBUG] Category saved successfully");
        
        return categoryMapper.toDTO(updated);
    }

    @Transactional
    public void deleteCategory(Long userId, Long id) {
        categoryRepository.findById(id).ifPresent(c -> {
            if (c.getUserId().equals(userId)) {
                categoryRepository.delete(c);
            }
        });
    }
}
