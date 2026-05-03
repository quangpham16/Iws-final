package com.finance.tracker.dto;

import com.finance.tracker.model.Budget.PeriodType;
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
public class BudgetDTO {
    private Long id;
    private Long userId;
    private String name;
    private PeriodType periodType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amount;
    private Long categoryId;
    private BigDecimal spentAmount;
    private LocalDateTime createdAt;
}
