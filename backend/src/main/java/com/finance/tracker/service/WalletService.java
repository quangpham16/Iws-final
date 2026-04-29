package com.finance.tracker.service;

import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WalletService {

    private final WalletRepository walletRepository;

    // -- Read ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<Wallet> findAll() {
        return walletRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Wallet findById(Long id) {
        return walletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Wallet> search(String keyword) {
        return walletRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalBalance() {
        return walletRepository.sumTotalBalance();
    }

    // -- Write -----------------------------------------------------------------

    public Wallet create(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    public Wallet update(Long id, Wallet updated) {
        Wallet existing = findById(id);
        existing.setName(updated.getName());
        existing.setBalance(updated.getBalance());
        existing.setCurrency(updated.getCurrency());
        existing.setNote(updated.getNote());
        return walletRepository.save(existing);
    }

    public void delete(Long id) {
        Wallet existing = findById(id);
        walletRepository.delete(existing);
    }
}
