package com.finance.tracker.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Amount is required")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;   // INCOME | EXPENSE

    @Column(length = 100)
    private String category;

    @NotNull(message = "Date is required")
    @Column(name = "transaction_date", nullable = false)
    private LocalDate date;

    @Column(length = 500)
    private String note;

    @Column(name = "payee_id")
    private Long payeeId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.cleared;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionSource source = TransactionSource.manual;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum TransactionType {
        INCOME, EXPENSE
    }

    public enum TransactionStatus {
        pending, cleared, reconciled
    }

    public enum TransactionSource {
        manual, csv_import, bank_sync, recurring
    }
}
