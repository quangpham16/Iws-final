package com.finance.tracker.controller;

import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // GET /api/transactions
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAll(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(transactionService.findAll(userId));
    }

    // GET /api/transactions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.findById(id));
    }

    // GET /api/transactions/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<TransactionDTO>> getByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(transactionService.findByCategoryId(categoryId));
    }

    // GET /api/transactions/range?from=2024-01-01&to=2024-12-31
    @GetMapping("/range")
    public ResponseEntity<List<TransactionDTO>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(transactionService.findByDateRange(from, to));
    }


    // GET /api/transactions/summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getSummary(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(transactionService.getSummary(userId));
    }

    // POST /api/transactions
    @PostMapping
    public ResponseEntity<TransactionDTO> create(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody TransactionDTO transactionDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(userId, transactionDto));
    }

    // PUT /api/transactions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDTO transactionDto) {
        return ResponseEntity.ok(transactionService.update(id, transactionDto));
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
