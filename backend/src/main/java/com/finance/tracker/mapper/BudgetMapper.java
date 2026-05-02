package com.finance.tracker.mapper;

import com.finance.tracker.dto.BudgetDTO;
import com.finance.tracker.model.Budget;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class BudgetMapper {
    public BudgetDTO toDTO(Budget budget, BigDecimal spentAmount) {
        if (budget == null) return null;
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setName(budget.getName());
        dto.setPeriodType(budget.getPeriodType() != null ? budget.getPeriodType().name() : null);
        dto.setStartDate(budget.getStartDate());
        dto.setEndDate(budget.getEndDate());
        dto.setAmount(budget.getAmount());
        dto.setCreatedAt(budget.getCreatedAt());
        dto.setSpentAmount(spentAmount != null ? spentAmount : BigDecimal.ZERO);
        return dto;
    }

    public Budget toEntity(BudgetDTO dto) {
        if (dto == null) return null;
        Budget budget = new Budget();
        budget.setName(dto.getName());
        if (dto.getPeriodType() != null) {
            budget.setPeriodType(Budget.PeriodType.valueOf(dto.getPeriodType()));
        }
        budget.setStartDate(dto.getStartDate());
        budget.setEndDate(dto.getEndDate());
        budget.setAmount(dto.getAmount());
        return budget;
    }
}
