package com.finance.tracker.controller;

import com.finance.tracker.dto.PayeeDTO;
import com.finance.tracker.service.PayeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payees")
@RequiredArgsConstructor
public class PayeeController {
    private final PayeeService payeeService;

    @GetMapping
    public List<PayeeDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return payeeService.getAllPayees(userId);
    }

    @PostMapping
    public ResponseEntity<PayeeDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody PayeeDTO payeeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(payeeService.createPayee(userId, payeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        payeeService.deletePayee(userId, id);
        return ResponseEntity.noContent().build();
    }
}
