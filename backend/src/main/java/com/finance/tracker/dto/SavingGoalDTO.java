package com.finance.tracker.dto;

import com.finance.tracker.model.SavingGoal.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingGoalDTO {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private String currencyCode;
    private LocalDate targetDate;
    private String icon;
    private String colorHex;
    private GoalStatus status;
    private LocalDateTime createdAt;
}
