package com.finance.tracker.controller;

import com.finance.tracker.model.Wallet;
import com.finance.tracker.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    // GET /api/wallets
    @GetMapping
    public ResponseEntity<List<Wallet>> getAll(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(walletService.findAll(userId));
    }

    // GET /api/wallets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Wallet> getById(@PathVariable Long id) {
        return ResponseEntity.ok(walletService.findById(id));
    }

    // GET /api/wallets/search?keyword=savings
    @GetMapping("/search")
    public ResponseEntity<List<Wallet>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(walletService.search(keyword));
    }

    // GET /api/wallets/total-balance
    @GetMapping("/total-balance")
    public ResponseEntity<Map<String, BigDecimal>> getTotalBalance() {
        return ResponseEntity.ok(Map.of("totalBalance", walletService.getTotalBalance()));
    }

    // POST /api/wallets
    @PostMapping
    public ResponseEntity<Wallet> create(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody Wallet wallet) {
        wallet.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(walletService.create(wallet));
    }

    // PUT /api/wallets/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Wallet> update(
            @PathVariable Long id,
            @Valid @RequestBody Wallet wallet) {
        return ResponseEntity.ok(walletService.update(id, wallet));
    }

    // DELETE /api/wallets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        walletService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
