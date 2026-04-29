package com.finance.tracker.controller;

import com.finance.tracker.model.Budget;
import com.finance.tracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetRepository budgetRepository;

    @GetMapping
    public List<Budget> getAll(@RequestHeader("X-User-Id") Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Budget> create(@RequestHeader("X-User-Id") Long userId, @RequestBody Budget budget) {
        budget.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetRepository.save(budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        budgetRepository.findById(id).ifPresent(b -> {
            if (b.getUserId().equals(userId)) budgetRepository.delete(b);
        });
        return ResponseEntity.noContent().build();
    }
}
