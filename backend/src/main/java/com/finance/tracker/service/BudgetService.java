package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetDTO;
import com.finance.tracker.mapper.BudgetMapper;
import com.finance.tracker.model.Budget;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetMapper budgetMapper;

    @Transactional(readOnly = true)
    public List<BudgetDTO> getAllBudgets(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        return budgets.stream()
                .map(budget -> {
                    BigDecimal spent = transactionRepository.sumByDateRange(userId, budget.getStartDate(), budget.getEndDate());
                    return budgetMapper.toDTO(budget, spent);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public BudgetDTO createBudget(Long userId, BudgetDTO dto) {
        Budget budget = budgetMapper.toEntity(dto);
        budget.setUserId(userId);
        budget.setCreatedAt(java.time.LocalDateTime.now());
        Budget saved = budgetRepository.save(budget);
        return budgetMapper.toDTO(saved, java.math.BigDecimal.ZERO);
    }

    @Transactional
    public void deleteBudget(Long userId, Long id) {
        budgetRepository.findById(id).ifPresent(b -> {
            if (b.getUserId().equals(userId)) {
                budgetRepository.delete(b);
            }
        });
    }
}
