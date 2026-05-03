package com.finance.tracker.mapper;

import com.finance.tracker.dto.SavingGoalDTO;
import com.finance.tracker.model.SavingGoal;
import org.springframework.stereotype.Component;

@Component
public class SavingGoalMapper {
    public SavingGoalDTO toDTO(SavingGoal goal) {
        if (goal == null) return null;
        return SavingGoalDTO.builder()
                .id(goal.getId())
                .userId(goal.getUserId())
                .name(goal.getName())
                .description(goal.getDescription())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .currencyCode(goal.getCurrencyCode())
                .targetDate(goal.getTargetDate())
                .icon(goal.getIcon())
                .colorHex(goal.getColorHex())
                .status(goal.getStatus())
                .createdAt(goal.getCreatedAt())
                .build();
    }

    public SavingGoal toEntity(SavingGoalDTO dto) {
        if (dto == null) return null;
        return SavingGoal.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .description(dto.getDescription())
                .targetAmount(dto.getTargetAmount())
                .currentAmount(dto.getCurrentAmount() != null ? dto.getCurrentAmount() : java.math.BigDecimal.ZERO)
                .currencyCode(dto.getCurrencyCode() != null ? dto.getCurrencyCode() : "VND")
                .targetDate(dto.getTargetDate())
                .icon(dto.getIcon())
                .colorHex(dto.getColorHex())
                .status(dto.getStatus() != null ? dto.getStatus() : SavingGoal.GoalStatus.active)
                .build();
    }
}
