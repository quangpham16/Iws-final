package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "estimated_amount", nullable = false)
    private BigDecimal estimatedAmount;

    @Builder.Default
    @Column(name = "currency_code")
    private String currencyCode = "VND";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(name = "trial_end_date")
    private LocalDate trialEndDate;

    @Column(length = 100)
    private String category;

    @Builder.Default
    @Column(name = "reminder_days")
    private Integer reminderDays = 3;

    @Column(length = 500)
    private String note;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status = SubscriptionStatus.active;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Frequency {
        weekly, monthly, yearly
    }

    public enum SubscriptionStatus {
        active, cancelled, paused
    }
}
