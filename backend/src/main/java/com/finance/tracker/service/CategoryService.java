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
        Category category = categoryMapper.toEntity(dto);
        category.setUserId(userId);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
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
