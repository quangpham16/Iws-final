package com.finance.tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Balance is required")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(name = "currency", nullable = false) // Bạn có thể bỏ nullable = false nếu không bắt buộc
    private String currency;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(length = 500)
    private String note;

}
