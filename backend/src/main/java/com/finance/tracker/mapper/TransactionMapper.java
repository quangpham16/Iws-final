package com.finance.tracker.mapper;

import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.model.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionDTO toDTO(Transaction entity) {
        if (entity == null) return null;
        return TransactionDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .walletId(entity.getWalletId())
                .payeeId(entity.getPayeeId())
                .date(entity.getDate())
                .time(entity.getTime())
                .amount(entity.getAmount())
                .currencyCode(entity.getCurrencyCode())
                .status(entity.getStatus())
                .note(entity.getNote())
                .categoryId(entity.getCategoryId())
                .tagIds(entity.getTagIds())
                .source(entity.getSource())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Transaction toEntity(TransactionDTO dto) {
        if (dto == null) return null;
        return Transaction.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .walletId(dto.getWalletId())
                .payeeId(dto.getPayeeId())
                .date(dto.getDate())
                .time(dto.getTime())
                .amount(dto.getAmount())
                .currencyCode(dto.getCurrencyCode())
                .status(dto.getStatus() != null ? dto.getStatus() : Transaction.TransactionStatus.cleared)
                .note(dto.getNote())
                .categoryId(dto.getCategoryId())
                .tagIds(dto.getTagIds())
                .source(dto.getSource() != null ? dto.getSource() : Transaction.TransactionSource.manual)
                .build();
    }
}
