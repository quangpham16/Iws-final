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
}
