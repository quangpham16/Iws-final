package com.finance.tracker.dto;

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
    private String name;
    private BigDecimal balance;
    private String currency;
    private String note;
    private LocalDateTime createdAt;
}
