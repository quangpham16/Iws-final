package com.finance.tracker.controller;

import com.finance.tracker.dto.CategoryDTO;
import com.finance.tracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return categoryService.getAllCategories(userId);
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody CategoryDTO categoryDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(userId, categoryDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        categoryService.deleteCategory(userId, id);
        return ResponseEntity.noContent().build();
    }
}
