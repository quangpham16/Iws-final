package com.finance.tracker.service;

import com.finance.tracker.dto.SubscriptionDTO;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.mapper.SubscriptionMapper;
import com.finance.tracker.model.Subscription;
import com.finance.tracker.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;

    @Transactional(readOnly = true)
    public List<SubscriptionDTO> getAllSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId).stream()
                .map(subscriptionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionDTO createSubscription(Long userId, SubscriptionDTO dto) {
        Subscription subscription = subscriptionMapper.toEntity(dto);
        subscription.setUserId(userId);
        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(saved);
    }

    @Transactional
    public SubscriptionDTO updateSubscription(Long userId, Long id, SubscriptionDTO dto) {
        Subscription subscription = subscriptionRepository.findById(id)
                .filter(s -> s.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        subscription.setName(dto.getName());
        subscription.setEstimatedAmount(dto.getEstimatedAmount());
        if (dto.getCurrencyCode() != null) subscription.setCurrencyCode(dto.getCurrencyCode());
        if (dto.getFrequency() != null) subscription.setFrequency(Subscription.Frequency.valueOf(dto.getFrequency()));
        subscription.setNextDueDate(dto.getNextDueDate());
        subscription.setTrialEndDate(dto.getTrialEndDate());
        subscription.setCategory(dto.getCategory());
        if (dto.getReminderDays() != null) subscription.setReminderDays(dto.getReminderDays());
        subscription.setNote(dto.getNote());
        if (dto.getStatus() != null) subscription.setStatus(Subscription.SubscriptionStatus.valueOf(dto.getStatus()));
        return subscriptionMapper.toDTO(subscriptionRepository.save(subscription));
    }

    @Transactional
    public void deleteSubscription(Long userId, Long id) {
        subscriptionRepository.findById(id).ifPresent(s -> {
            if (s.getUserId().equals(userId)) {
                subscriptionRepository.delete(s);
            }
        });
    }
}
