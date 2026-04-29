package com.finance.tracker.controller;

import com.finance.tracker.model.Category;
import com.finance.tracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAll(@RequestHeader("X-User-Id") Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestHeader("X-User-Id") Long userId, @RequestBody Category category) {
        category.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        categoryRepository.findById(id).ifPresent(c -> {
            if (c.getUserId().equals(userId)) categoryRepository.delete(c);
        });
        return ResponseEntity.noContent().build();
    }
}
