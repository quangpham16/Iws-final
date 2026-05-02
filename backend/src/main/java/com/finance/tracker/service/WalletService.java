package com.finance.tracker.service;

import com.finance.tracker.dto.WalletDTO;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.mapper.WalletMapper;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;

    // -- Read ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<WalletDTO> findAll(Long userId) {
        return walletRepository.findByUserId(userId).stream()
                .map(walletMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WalletDTO findById(Long id) {
        return walletRepository.findById(id)
                .map(walletMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", id));
    }

    @Transactional(readOnly = true)
    public List<WalletDTO> search(String keyword) {
        return walletRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(walletMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalBalance(Long userId) {
        return Objects.requireNonNullElse(walletRepository.sumTotalBalanceByUserId(userId), BigDecimal.ZERO);
    }

    // -- Write -----------------------------------------------------------------

    public WalletDTO create(Long userId, WalletDTO dto) {
        Wallet entity = walletMapper.toEntity(dto);
        entity.setUserId(userId);
        entity.setCreatedAt(java.time.LocalDateTime.now());
        return walletMapper.toDTO(walletRepository.save(entity));
    }

    public WalletDTO update(Long id, WalletDTO updatedDto) {
        Wallet existing = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", id));
        existing.setName(updatedDto.getName());
        existing.setBalance(updatedDto.getBalance());
        existing.setCurrency(updatedDto.getCurrency());
        existing.setNote(updatedDto.getNote());
        return walletMapper.toDTO(walletRepository.save(existing));
    }

    public void delete(Long id) {
        if (!walletRepository.existsById(id)) {
            throw new ResourceNotFoundException("Wallet", id);
        }
        walletRepository.deleteById(id);
    }
}
