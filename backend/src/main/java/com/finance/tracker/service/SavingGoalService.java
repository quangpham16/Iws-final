package com.finance.tracker.service;

import com.finance.tracker.dto.SavingGoalDTO;
import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.mapper.SavingGoalMapper;
import com.finance.tracker.model.SavingGoal;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.SavingGoalRepository;
import com.finance.tracker.repository.WalletRepository;
import com.finance.tracker.service.TransactionService;
import com.finance.tracker.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingGoalService {
    private final SavingGoalRepository savingGoalRepository;
    private final SavingGoalMapper savingGoalMapper;
    private final WalletRepository walletRepository;
    private final TransactionService transactionService;

    @Transactional(readOnly = true)
    public List<SavingGoalDTO> getAllGoals(Long userId) {
        return savingGoalRepository.findByUserId(userId).stream()
                .map(savingGoalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavingGoalDTO createGoal(Long userId, SavingGoalDTO dto) {
        SavingGoal goal = savingGoalMapper.toEntity(dto);
        goal.setUserId(userId);
        goal.setCreatedAt(java.time.LocalDateTime.now());
        SavingGoal saved = savingGoalRepository.save(goal);
        return savingGoalMapper.toDTO(saved);
    }

    @Transactional
    public void deleteGoal(Long userId, Long id) {
        savingGoalRepository.findById(id).ifPresent(g -> {
            if (g.getUserId().equals(userId)) {
                savingGoalRepository.delete(g);
            }
        });
    }

    @Transactional
    public SavingGoalDTO fundGoal(Long userId, Long goalId, Long walletId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        SavingGoal goal = savingGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("SavingGoal", goalId));
        if (!goal.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("SavingGoal", goalId);
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", walletId));
        if (!wallet.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Wallet", walletId);
        }

        BigDecimal walletBalance = wallet.getCurrentBalance() != null ? wallet.getCurrentBalance() : BigDecimal.ZERO;
        if (walletBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds in the selected wallet");
        }

        // Increase goal current amount
        BigDecimal current = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;
        goal.setCurrentAmount(current.add(amount));
        savingGoalRepository.save(goal);

        // Create a transaction that debits the wallet (negative amount)
        TransactionDTO txn = TransactionDTO.builder()
                .walletId(walletId)
                .amount(amount.negate())
                .date(LocalDate.now())
                .currencyCode(wallet.getCurrencyCode())
                .note("Fund goal: " + goal.getName())
                .source(com.finance.tracker.model.Transaction.TransactionSource.manual)
                .status(com.finance.tracker.model.Transaction.TransactionStatus.cleared)
                .build();

        transactionService.create(userId, txn);

        return savingGoalMapper.toDTO(goal);
    }
}
