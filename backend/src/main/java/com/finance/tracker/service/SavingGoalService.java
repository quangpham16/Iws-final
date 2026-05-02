package com.finance.tracker.service;

import com.finance.tracker.dto.SavingGoalDTO;
import com.finance.tracker.mapper.SavingGoalMapper;
import com.finance.tracker.model.SavingGoal;
import com.finance.tracker.repository.SavingGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingGoalService {
    private final SavingGoalRepository savingGoalRepository;
    private final SavingGoalMapper savingGoalMapper;

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
    public SavingGoalDTO updateGoal(Long userId, Long id, SavingGoalDTO dto) {
        SavingGoal existing = savingGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to goal");
        }

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setTargetAmount(dto.getTargetAmount());
        existing.setCurrentAmount(dto.getCurrentAmount());
        existing.setCurrencyCode(dto.getCurrencyCode());
        existing.setTargetDate(dto.getTargetDate());
        existing.setIcon(dto.getIcon());
        existing.setColorHex(dto.getColorHex());
        if (dto.getStatus() != null) {
            existing.setStatus(SavingGoal.GoalStatus.valueOf(dto.getStatus()));
        }

        SavingGoal saved = savingGoalRepository.save(existing);
        return savingGoalMapper.toDTO(saved);
    }
}
