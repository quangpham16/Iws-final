package com.finance.tracker.controller;

import com.finance.tracker.model.Payee;
import com.finance.tracker.repository.PayeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payees")
@RequiredArgsConstructor
public class PayeeController {
    private final PayeeRepository payeeRepository;

    @GetMapping
    public List<Payee> getAll(@RequestHeader("X-User-Id") Long userId) {
        return payeeRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Payee> create(@RequestHeader("X-User-Id") Long userId, @RequestBody Payee payee) {
        payee.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(payeeRepository.save(payee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        payeeRepository.findById(id).ifPresent(p -> {
            if (p.getUserId().equals(userId)) payeeRepository.delete(p);
        });
        return ResponseEntity.noContent().build();
    }
}
