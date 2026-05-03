package com.finance.tracker.controller;

import com.finance.tracker.dto.BudgetDTO;
import com.finance.tracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping
    public List<BudgetDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return budgetService.getAllBudgets(userId);
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody BudgetDTO budgetDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.createBudget(userId, budgetDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        budgetService.deleteBudget(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> update(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id, @RequestBody BudgetDTO budgetDTO) {
        return ResponseEntity.ok(budgetService.updateBudget(userId, id, budgetDTO));
    }
}
