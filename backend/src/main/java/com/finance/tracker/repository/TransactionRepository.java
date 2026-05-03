package com.finance.tracker.repository;

import com.finance.tracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Filter by user
    List<Transaction> findByUserId(Long userId);

    // Filter by category
    List<Transaction> findByCategoryId(Long categoryId);

    // Filter by wallet (account)
    List<Transaction> findByWalletId(Long walletId);

    // Filter by date range
    List<Transaction> findByDateBetween(LocalDate from, LocalDate to);

    // Sum of all transactions for user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId")
    java.math.BigDecimal sumTotalByUserId(Long userId);

    // Sum by date range
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.userId = :userId AND t.date BETWEEN :startDate AND :endDate")
    java.math.BigDecimal sumByDateRange(Long userId, LocalDate startDate, LocalDate endDate);

    // Search by note (replacing title search)
    List<Transaction> findByNoteContainingIgnoreCase(String keyword);
}
