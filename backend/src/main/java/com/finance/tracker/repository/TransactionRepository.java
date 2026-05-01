package com.finance.tracker.repository;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Filter by user
    List<Transaction> findByUserId(Long userId);

    // Filter by type (INCOME / EXPENSE)
    List<Transaction> findByType(TransactionType type);

    // Filter by category
    List<Transaction> findByCategory(String category);

    // Filter by date range
    List<Transaction> findByDateBetween(LocalDate from, LocalDate to);

    // Search by title (case-insensitive)
    List<Transaction> findByTitleContainingIgnoreCase(String keyword);

    // Sum of all income for user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'INCOME' AND t.userId = :userId")
    java.math.BigDecimal sumIncome(Long userId);

    // Sum of all expenses for user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.userId = :userId")
    java.math.BigDecimal sumExpense(Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.userId = :userId AND t.date BETWEEN :startDate AND :endDate")
    java.math.BigDecimal sumExpenseByDateRange(Long userId, LocalDate startDate, LocalDate endDate);
}
