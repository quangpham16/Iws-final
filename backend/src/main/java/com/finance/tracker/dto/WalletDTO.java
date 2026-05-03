package com.finance.tracker.dto;

import com.finance.tracker.model.Wallet.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletDTO {
    private Long id;
    private Long userId;
    private String name;
    private AccountType type;
    private String currencyCode;
    private BigDecimal initialBalance;
    private BigDecimal currentBalance;
    private String institutionName;
    private String colorHex;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
