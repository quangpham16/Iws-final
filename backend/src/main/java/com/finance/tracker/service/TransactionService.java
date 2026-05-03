package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.mapper.TransactionMapper;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.WalletRepository;
import com.finance.tracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final WalletRepository walletRepository;

    // ── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TransactionDTO> findAll(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionDTO findById(Long id) {
        return transactionRepository.findById(id)
                .map(transactionMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> findByCategoryId(Long categoryId) {
        return transactionRepository.findByCategoryId(categoryId).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> findByDateRange(LocalDate from, LocalDate to) {
        return transactionRepository.findByDateBetween(from, to).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getSummary(Long userId) {
        BigDecimal total = Objects.requireNonNullElse(transactionRepository.sumTotalByUserId(userId), BigDecimal.ZERO);
        return Map.of(
                "total", total,
                "count", BigDecimal.valueOf(transactionRepository.findByUserId(userId).size())
        );
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public TransactionDTO create(Long userId, TransactionDTO dto) {
        Transaction entity = transactionMapper.toEntity(dto);
        entity.setUserId(userId);
        entity.setCreatedAt(java.time.LocalDateTime.now());
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        Transaction saved = transactionRepository.save(entity);
        recalculateWalletBalance(saved.getWalletId());
        return transactionMapper.toDTO(saved);
    }

    public TransactionDTO update(Long id, TransactionDTO updatedDto) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        Long oldWalletId = existing.getWalletId();
        
        existing.setAmount(updatedDto.getAmount());
        existing.setCurrencyCode(updatedDto.getCurrencyCode());
        existing.setCategoryId(updatedDto.getCategoryId());
        existing.setDate(updatedDto.getDate());
        existing.setNote(updatedDto.getNote());
        existing.setWalletId(updatedDto.getWalletId());
        existing.setPayeeId(updatedDto.getPayeeId());
        existing.setTagIds(updatedDto.getTagIds());
        if (updatedDto.getStatus() != null) {
            existing.setStatus(updatedDto.getStatus());
        }
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        
        Transaction saved = transactionRepository.save(existing);
        recalculateWalletBalance(oldWalletId);
        if (!Objects.equals(oldWalletId, updatedDto.getWalletId())) {
            recalculateWalletBalance(updatedDto.getWalletId());
        }
        return transactionMapper.toDTO(saved);
    }

    public void delete(Long id) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        Long walletId = existing.getWalletId();
        transactionRepository.deleteById(id);
        recalculateWalletBalance(walletId);
    }

    // ── Wallet balance recalculation ───────────────────────────────────────────

    private void recalculateWalletBalance(Long walletId) {
        if (walletId == null) return;
        Wallet wallet = walletRepository.findById(walletId).orElse(null);
        if (wallet == null) return;
        BigDecimal initial = Objects.requireNonNullElse(wallet.getInitialBalance(), BigDecimal.ZERO);
        BigDecimal txnSum = transactionRepository.sumByWalletId(walletId);
        wallet.setCurrentBalance(initial.add(txnSum));
        wallet.setUpdatedAt(java.time.LocalDateTime.now());
        walletRepository.save(wallet);
    }
}
