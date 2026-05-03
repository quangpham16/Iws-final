package com.finance.tracker.dto;

import com.finance.tracker.model.Transaction.TransactionStatus;
import com.finance.tracker.model.Transaction.TransactionSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private Long userId;
    private Long walletId;
    private Long payeeId;
    private LocalDate date;
    private BigDecimal amount;
    private String currencyCode;
    private TransactionStatus status;
    private String note;
    private Long categoryId;
    private List<Long> tagIds;
    private TransactionSource source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
