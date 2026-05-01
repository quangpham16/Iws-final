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
                .title(entity.getTitle())
                .amount(entity.getAmount())
                .type(entity.getType())
                .category(entity.getCategory())
                .date(entity.getDate())
                .note(entity.getNote())
                .walletId(entity.getWalletId())
                .build();
    }

    public Transaction toEntity(TransactionDTO dto) {
        if (dto == null) return null;
        return Transaction.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(dto.getCategory())
                .date(dto.getDate())
                .note(dto.getNote())
                .walletId(dto.getWalletId())
                .build();
    }
}
