package com.finance.tracker.dto;

import com.finance.tracker.model.Transaction.TransactionType;
import com.finance.tracker.model.Transaction.TransactionStatus;
import com.finance.tracker.model.Transaction.TransactionSource;
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
public class TransactionDTO {
    private Long id;
    private String title;
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private LocalDate date;
    private String note;
    private Long payeeId;
    private Long walletId;
    private TransactionStatus status;
    private TransactionSource source;
    private LocalDateTime createdAt;
}
