package com.finance.tracker.service;

import com.finance.tracker.dto.PayeeDTO;
import com.finance.tracker.mapper.PayeeMapper;
import com.finance.tracker.model.Payee;
import com.finance.tracker.repository.PayeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayeeService {
    private final PayeeRepository payeeRepository;
    private final PayeeMapper payeeMapper;

    @Transactional(readOnly = true)
    public List<PayeeDTO> getAllPayees(Long userId) {
        return payeeRepository.findByUserId(userId).stream()
                .map(payeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayeeDTO createPayee(Long userId, PayeeDTO dto) {
        Payee payee = payeeMapper.toEntity(dto);
        payee.setUserId(userId);
        payee.setCreatedAt(java.time.LocalDateTime.now());
        Payee saved = payeeRepository.save(payee);
        return payeeMapper.toDTO(saved);
    }

    @Transactional
    public void deletePayee(Long userId, Long id) {
        payeeRepository.findById(id).ifPresent(p -> {
            if (p.getUserId().equals(userId)) {
                payeeRepository.delete(p);
            }
        });
    }
}
