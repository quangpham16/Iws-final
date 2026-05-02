package com.finance.tracker.controller;

import com.finance.tracker.dto.SubscriptionDTO;
import com.finance.tracker.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping
    public List<SubscriptionDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return subscriptionService.getAllSubscriptions(userId);
    }

    @PostMapping
    public ResponseEntity<SubscriptionDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody SubscriptionDTO subDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.createSubscription(userId, subDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> update(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @RequestBody SubscriptionDTO dto) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        subscriptionService.deleteSubscription(userId, id);
        return ResponseEntity.noContent().build();
    }
}
