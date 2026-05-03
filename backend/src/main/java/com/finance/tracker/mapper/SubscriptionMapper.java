package com.finance.tracker.mapper;

import com.finance.tracker.dto.SubscriptionDTO;
import com.finance.tracker.model.Subscription;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {
    public SubscriptionDTO toDTO(Subscription subscription) {
        if (subscription == null) return null;
        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .userId(subscription.getUserId())
                .name(subscription.getName())
                .estimatedAmount(subscription.getEstimatedAmount())
                .currencyCode(subscription.getCurrencyCode())
                .frequency(subscription.getFrequency())
                .nextDueDate(subscription.getNextDueDate())
                .trialEndDate(subscription.getTrialEndDate())
                .category(subscription.getCategory())
                .reminderDays(subscription.getReminderDays())
                .note(subscription.getNote())
                .status(subscription.getStatus())
                .createdAt(subscription.getCreatedAt())
                .build();
    }

    public Subscription toEntity(SubscriptionDTO dto) {
        if (dto == null) return null;
        return Subscription.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .estimatedAmount(dto.getEstimatedAmount())
                .currencyCode(dto.getCurrencyCode() != null ? dto.getCurrencyCode() : "USD")
                .frequency(dto.getFrequency())
                .nextDueDate(dto.getNextDueDate())
                .trialEndDate(dto.getTrialEndDate())
                .category(dto.getCategory())
                .reminderDays(dto.getReminderDays() != null ? dto.getReminderDays() : 3)
                .note(dto.getNote())
                .status(dto.getStatus() != null ? dto.getStatus() : Subscription.SubscriptionStatus.active)
                .build();
    }
}
