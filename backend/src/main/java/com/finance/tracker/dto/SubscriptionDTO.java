package com.finance.tracker.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SubscriptionDTO {
    private Long id;
    private String name;
    private BigDecimal estimatedAmount;
    private String currencyCode;
    private String frequency;
    private LocalDate nextDueDate;
    private LocalDate trialEndDate;
    private String category;
    private Integer reminderDays;
    private String note;
    private String status;
    private LocalDateTime createdAt;
}
