package com.finance.tracker.mapper;

import com.finance.tracker.dto.PayeeDTO;
import com.finance.tracker.model.Payee;
import org.springframework.stereotype.Component;

@Component
public class PayeeMapper {
    public PayeeDTO toDTO(Payee payee) {
        if (payee == null) return null;
        return PayeeDTO.builder()
                .id(payee.getId())
                .userId(payee.getUserId())
                .name(payee.getName())
                .website(payee.getWebsite())
                .notes(payee.getNotes())
                .createdAt(payee.getCreatedAt())
                .build();
    }

    public Payee toEntity(PayeeDTO dto) {
        if (dto == null) return null;
        return Payee.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .website(dto.getWebsite())
                .notes(dto.getNotes())
                .build();
    }
}
