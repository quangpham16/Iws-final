package com.finance.tracker.mapper;

import com.finance.tracker.dto.BudgetDTO;
import com.finance.tracker.model.Budget;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class BudgetMapper {
    public BudgetDTO toDTO(Budget budget, BigDecimal spentAmount) {
        if (budget == null) return null;
        return BudgetDTO.builder()
                .id(budget.getId())
                .userId(budget.getUserId())
                .name(budget.getName())
                .periodType(budget.getPeriodType())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .amount(budget.getAmount())
                .categoryId(budget.getCategoryId())
                .spentAmount(spentAmount != null ? spentAmount : BigDecimal.ZERO)
                .createdAt(budget.getCreatedAt())
                .build();
    }

    public Budget toEntity(BudgetDTO dto) {
        if (dto == null) return null;
        return Budget.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .periodType(dto.getPeriodType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .amount(dto.getAmount())
                .categoryId(dto.getCategoryId())
                .build();
    }
}
