package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "saving_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavingGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "target_amount", nullable = false)
    private BigDecimal targetAmount;

    @Builder.Default
    @Column(name = "current_amount")
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "currency_code")
    private String currencyCode = "VND";

    @Column(name = "target_date")
    private LocalDate targetDate;

    private String icon;

    @Column(name = "color_hex")
    private String colorHex;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GoalStatus status = GoalStatus.active;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum GoalStatus {
        active, completed, cancelled
    }
}
