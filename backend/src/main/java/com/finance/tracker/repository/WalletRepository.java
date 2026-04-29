package com.finance.tracker.repository;

import com.finance.tracker.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUserId(Long userId);

    // Search by name (case-insensitive)
    List<Wallet> findByNameContainingIgnoreCase(String keyword);

    // Check if a wallet name already exists
    boolean existsByNameIgnoreCase(String name);

    // Sum of all wallet balances
    @Query("SELECT COALESCE(SUM(w.balance), 0) FROM Wallet w")
    BigDecimal sumTotalBalance();
}
