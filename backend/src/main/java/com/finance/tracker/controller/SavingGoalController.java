package com.finance.tracker.controller;

import com.finance.tracker.dto.SavingGoalDTO;
import com.finance.tracker.service.SavingGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingGoalController {
    private final SavingGoalService savingGoalService;

    @GetMapping
    public List<SavingGoalDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return savingGoalService.getAllGoals(userId);
    }

    @PostMapping
    public ResponseEntity<SavingGoalDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody SavingGoalDTO goalDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(savingGoalService.createGoal(userId, goalDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        savingGoalService.deleteGoal(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingGoalDTO> update(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id, @RequestBody SavingGoalDTO goalDTO) {
        return ResponseEntity.ok(savingGoalService.updateGoal(userId, id, goalDTO));
    }
}
