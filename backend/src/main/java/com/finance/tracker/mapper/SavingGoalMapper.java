package com.finance.tracker.mapper;

import com.finance.tracker.dto.SavingGoalDTO;
import com.finance.tracker.model.SavingGoal;
import org.springframework.stereotype.Component;

@Component
public class SavingGoalMapper {
    public SavingGoalDTO toDTO(SavingGoal goal) {
        if (goal == null) return null;
        SavingGoalDTO dto = new SavingGoalDTO();
        dto.setId(goal.getId());
        dto.setName(goal.getName());
        dto.setDescription(goal.getDescription());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setCurrencyCode(goal.getCurrencyCode());
        dto.setTargetDate(goal.getTargetDate());
        dto.setIcon(goal.getIcon());
        dto.setColorHex(goal.getColorHex());
        dto.setStatus(goal.getStatus() != null ? goal.getStatus().name() : null);
        dto.setCreatedAt(goal.getCreatedAt());
        return dto;
    }

    public SavingGoal toEntity(SavingGoalDTO dto) {
        if (dto == null) return null;
        SavingGoal goal = new SavingGoal();
        goal.setName(dto.getName());
        goal.setDescription(dto.getDescription());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAmount(dto.getCurrentAmount());
        goal.setCurrencyCode(dto.getCurrencyCode());
        goal.setTargetDate(dto.getTargetDate());
        goal.setIcon(dto.getIcon());
        goal.setColorHex(dto.getColorHex());
        if (dto.getStatus() != null) {
            goal.setStatus(SavingGoal.GoalStatus.valueOf(dto.getStatus()));
        }
        return goal;
    }
}
