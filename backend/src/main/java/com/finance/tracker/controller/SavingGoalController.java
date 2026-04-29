package com.finance.tracker.controller;

import com.finance.tracker.model.SavingGoal;
import com.finance.tracker.repository.SavingGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingGoalController {
    private final SavingGoalRepository savingGoalRepository;

    @GetMapping
    public List<SavingGoal> getAll(@RequestHeader("X-User-Id") Long userId) {
        return savingGoalRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<SavingGoal> create(@RequestHeader("X-User-Id") Long userId, @RequestBody SavingGoal goal) {
        goal.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savingGoalRepository.save(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        savingGoalRepository.findById(id).ifPresent(g -> {
            if (g.getUserId().equals(userId)) savingGoalRepository.delete(g);
        });
        return ResponseEntity.noContent().build();
    }
}
