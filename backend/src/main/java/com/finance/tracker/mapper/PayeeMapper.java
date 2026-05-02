package com.finance.tracker.mapper;

import com.finance.tracker.dto.PayeeDTO;
import com.finance.tracker.model.Payee;
import org.springframework.stereotype.Component;

@Component
public class PayeeMapper {
    public PayeeDTO toDTO(Payee payee) {
        if (payee == null) return null;
        PayeeDTO dto = new PayeeDTO();
        dto.setId(payee.getId());
        dto.setName(payee.getName());
        dto.setWebsite(payee.getWebsite());
        dto.setNotes(payee.getNotes());
        dto.setCreatedAt(payee.getCreatedAt());
        return dto;
    }

    public Payee toEntity(PayeeDTO dto) {
        if (dto == null) return null;
        Payee payee = new Payee();
        payee.setName(dto.getName());
        payee.setWebsite(dto.getWebsite());
        payee.setNotes(dto.getNotes());
        return payee;
    }
}
