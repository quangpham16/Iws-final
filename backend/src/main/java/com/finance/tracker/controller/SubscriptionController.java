package com.finance.tracker.controller;

import com.finance.tracker.model.Subscription;
import com.finance.tracker.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionRepository subscriptionRepository;

    @GetMapping
    public List<Subscription> getAll(@RequestHeader("X-User-Id") Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Subscription> create(@RequestHeader("X-User-Id") Long userId, @RequestBody Subscription sub) {
        sub.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionRepository.save(sub));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        subscriptionRepository.findById(id).ifPresent(s -> {
            if (s.getUserId().equals(userId)) subscriptionRepository.delete(s);
        });
        return ResponseEntity.noContent().build();
    }
}
