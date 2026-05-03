package com.finance.tracker.mapper;

import com.finance.tracker.dto.WalletDTO;
import com.finance.tracker.model.Wallet;
import org.springframework.stereotype.Component;

@Component
public class WalletMapper {

    public WalletDTO toDTO(Wallet entity) {
        if (entity == null) return null;
        return WalletDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .name(entity.getName())
                .type(entity.getType())
                .currencyCode(entity.getCurrencyCode())
                .initialBalance(entity.getInitialBalance())
                .currentBalance(entity.getCurrentBalance())
                .institutionName(entity.getInstitutionName())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Wallet toEntity(WalletDTO dto) {
        if (dto == null) return null;
        return Wallet.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .name(dto.getName())
                .type(dto.getType())
                .currencyCode(dto.getCurrencyCode())
                .initialBalance(dto.getInitialBalance())
                .currentBalance(dto.getCurrentBalance())
                .institutionName(dto.getInstitutionName())
                .isActive(dto.getIsActive())
                .build();
    }
}
