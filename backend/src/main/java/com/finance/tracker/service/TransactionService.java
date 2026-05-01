package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.mapper.TransactionMapper;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.Transaction.TransactionType;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.TransactionRepository;
import com.finance.tracker.repository.WalletRepository;
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
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> findByType(TransactionType type) {
        return transactionRepository.findByType(type).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> findByCategory(String category) {
        return transactionRepository.findByCategory(category).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> findByDateRange(LocalDate from, LocalDate to) {
        return transactionRepository.findByDateBetween(from, to).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> search(String keyword) {
        return transactionRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getSummary(Long userId) {
        BigDecimal income  = Objects.requireNonNullElse(transactionRepository.sumIncome(userId), BigDecimal.ZERO);
        BigDecimal expense = Objects.requireNonNullElse(transactionRepository.sumExpense(userId), BigDecimal.ZERO);
        BigDecimal balance = income.subtract(expense);
        return Map.of(
                "totalIncome",  income,
                "totalExpense", expense,
                "balance",      balance
        );
    }

    // ── Write ─────────────────────────────────────────────────────────────────

    public TransactionDTO create(Long userId, TransactionDTO dto) {
        Transaction entity = transactionMapper.toEntity(dto);
        entity.setUserId(userId);
        Transaction saved = transactionRepository.save(entity);

        // Adjust wallet balance
        if (saved.getWalletId() != null) {
            Wallet wallet = walletRepository.findById(saved.getWalletId())
                    .orElseThrow(() -> new RuntimeException("Wallet not found with id: " + saved.getWalletId()));
            if (saved.getType() == TransactionType.INCOME) {
                wallet.setBalance(wallet.getBalance().add(saved.getAmount()));
            } else {
                wallet.setBalance(wallet.getBalance().subtract(saved.getAmount()));
            }
            walletRepository.save(wallet);
        }

        return transactionMapper.toDTO(saved);
    }

    public TransactionDTO update(Long id, TransactionDTO updatedDto) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        // Reverse old wallet balance
        if (existing.getWalletId() != null) {
            Wallet oldWallet = walletRepository.findById(existing.getWalletId())
                    .orElse(null);
            if (oldWallet != null) {
                if (existing.getType() == TransactionType.INCOME) {
                    oldWallet.setBalance(oldWallet.getBalance().subtract(existing.getAmount()));
                } else {
                    oldWallet.setBalance(oldWallet.getBalance().add(existing.getAmount()));
                }
                walletRepository.save(oldWallet);
            }
        }

        existing.setTitle(updatedDto.getTitle());
        existing.setAmount(updatedDto.getAmount());
        existing.setType(updatedDto.getType());
        existing.setCategory(updatedDto.getCategory());
        existing.setDate(updatedDto.getDate());
        existing.setNote(updatedDto.getNote());
        existing.setWalletId(updatedDto.getWalletId());
        
        Transaction saved = transactionRepository.save(existing);

        // Apply new wallet balance
        if (saved.getWalletId() != null) {
            Wallet newWallet = walletRepository.findById(saved.getWalletId())
                    .orElseThrow(() -> new RuntimeException("Wallet not found with id: " + saved.getWalletId()));
            if (saved.getType() == TransactionType.INCOME) {
                newWallet.setBalance(newWallet.getBalance().add(saved.getAmount()));
            } else {
                newWallet.setBalance(newWallet.getBalance().subtract(saved.getAmount()));
            }
            walletRepository.save(newWallet);
        }

        return transactionMapper.toDTO(saved);
    }

    public void delete(Long id) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        // Reverse wallet balance before deleting
        if (existing.getWalletId() != null) {
            Wallet wallet = walletRepository.findById(existing.getWalletId())
                    .orElse(null);
            if (wallet != null) {
                if (existing.getType() == TransactionType.INCOME) {
                    wallet.setBalance(wallet.getBalance().subtract(existing.getAmount()));
                } else {
                    wallet.setBalance(wallet.getBalance().add(existing.getAmount()));
                }
                walletRepository.save(wallet);
            }
        }

        transactionRepository.deleteById(id);
    }
}
