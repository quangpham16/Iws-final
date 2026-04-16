package com.finance.tracker.controller;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.Transaction.TransactionType;
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
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    // GET /api/transactions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.findById(id));
    }

    // GET /api/transactions/type/{type}   e.g. INCOME | EXPENSE
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getByType(@PathVariable TransactionType type) {
        return ResponseEntity.ok(transactionService.findByType(type));
    }

    // GET /api/transactions/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Transaction>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(transactionService.findByCategory(category));
    }

    // GET /api/transactions/range?from=2024-01-01&to=2024-12-31
    @GetMapping("/range")
    public ResponseEntity<List<Transaction>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(transactionService.findByDateRange(from, to));
    }

    // GET /api/transactions/search?keyword=groceries
    @GetMapping("/search")
    public ResponseEntity<List<Transaction>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(transactionService.search(keyword));
    }

    // GET /api/transactions/summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getSummary() {
        return ResponseEntity.ok(transactionService.getSummary());
    }

    // POST /api/transactions
    @PostMapping
    public ResponseEntity<Transaction> create(@Valid @RequestBody Transaction transaction) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(transaction));
    }

    // PUT /api/transactions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(
            @PathVariable Long id,
            @Valid @RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.update(id, transaction));
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
