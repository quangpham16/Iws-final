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
                    BigDecimal spent = transactionRepository.sumExpenseByDateRange(userId, budget.getStartDate(), budget.getEndDate());
                    return budgetMapper.toDTO(budget, spent);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public BudgetDTO createBudget(Long userId, BudgetDTO dto) {
        Budget budget = budgetMapper.toEntity(dto);
        budget.setUserId(userId);
        Budget saved = budgetRepository.save(budget);
        return budgetMapper.toDTO(saved, BigDecimal.ZERO);
    }

    @Transactional
    public void deleteBudget(Long userId, Long id) {
        budgetRepository.findById(id).ifPresent(b -> {
            if (b.getUserId().equals(userId)) {
                budgetRepository.delete(b);
            }
        });
    }

    @Transactional
    public BudgetDTO updateBudget(Long userId, Long id, BudgetDTO dto) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to budget");
        }
        
        existing.setName(dto.getName());
        if (dto.getPeriodType() != null) {
            existing.setPeriodType(Budget.PeriodType.valueOf(dto.getPeriodType()));
        }
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setAmount(dto.getAmount());
        
        Budget saved = budgetRepository.save(existing);
        BigDecimal spent = transactionRepository.sumExpenseByDateRange(userId, saved.getStartDate(), saved.getEndDate());
        return budgetMapper.toDTO(saved, spent);
    }
}
