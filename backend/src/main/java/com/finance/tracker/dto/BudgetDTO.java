package com.finance.tracker.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BudgetDTO {
    private Long id;
    private String name;
    private String periodType;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    // For UI progression
    private java.math.BigDecimal amount;
    private java.math.BigDecimal spentAmount;
}
