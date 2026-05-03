package com.finance.tracker.dto;

import com.finance.tracker.model.Subscription.Frequency;
import com.finance.tracker.model.Subscription.SubscriptionStatus;
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
public class SubscriptionDTO {
    private Long id;
    private Long userId;
    private String name;
    private BigDecimal estimatedAmount;
    private String currencyCode;
    private Frequency frequency;
    private LocalDate nextDueDate;
    private LocalDate trialEndDate;
    private String category;
    private Integer reminderDays;
    private String note;
    private SubscriptionStatus status;
    private LocalDateTime createdAt;
}
