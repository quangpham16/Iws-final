package com.finance.tracker.service;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.Transaction.TransactionType;
import com.finance.tracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Transaction> findAll(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Transaction findById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Transaction> findByType(TransactionType type) {
        return transactionRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<Transaction> findByCategory(String category) {
        return transactionRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Transaction> findByDateRange(LocalDate from, LocalDate to) {
        return transactionRepository.findByDateBetween(from, to);
    }

    @Transactional(readOnly = true)
    public List<Transaction> search(String keyword) {
        return transactionRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getSummary(Long userId) {
        BigDecimal income  = transactionRepository.sumIncome(userId);
        BigDecimal expense = transactionRepository.sumExpense(userId);
        BigDecimal balance = income.subtract(expense);
        return Map.of(
                "totalIncome",  income,
                "totalExpense", expense,
                "balance",      balance
        );
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public Transaction create(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction update(Long id, Transaction updated) {
        Transaction existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setAmount(updated.getAmount());
        existing.setType(updated.getType());
        existing.setCategory(updated.getCategory());
        existing.setDate(updated.getDate());
        existing.setNote(updated.getNote());
        return transactionRepository.save(existing);
    }

    public void delete(Long id) {
        Transaction existing = findById(id);
        transactionRepository.delete(existing);
    }
}
