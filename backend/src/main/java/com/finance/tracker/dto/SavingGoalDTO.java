package com.finance.tracker.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SavingGoalDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private String currencyCode;
    private LocalDate targetDate;
    private String icon;
    private String colorHex;
    private String status;
    private LocalDateTime createdAt;
}
