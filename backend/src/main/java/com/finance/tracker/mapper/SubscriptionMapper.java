package com.finance.tracker.mapper;

import com.finance.tracker.dto.SubscriptionDTO;
import com.finance.tracker.model.Subscription;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {
    public SubscriptionDTO toDTO(Subscription subscription) {
        if (subscription == null) return null;
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(subscription.getId());
        dto.setName(subscription.getName());
        dto.setEstimatedAmount(subscription.getEstimatedAmount());
        dto.setCurrencyCode(subscription.getCurrencyCode());
        dto.setFrequency(subscription.getFrequency() != null ? subscription.getFrequency().name() : null);
        dto.setNextDueDate(subscription.getNextDueDate());
        dto.setTrialEndDate(subscription.getTrialEndDate());
        dto.setCategory(subscription.getCategory());
        dto.setReminderDays(subscription.getReminderDays());
        dto.setNote(subscription.getNote());
        dto.setStatus(subscription.getStatus() != null ? subscription.getStatus().name() : null);
        dto.setCreatedAt(subscription.getCreatedAt());
        return dto;
    }

    public Subscription toEntity(SubscriptionDTO dto) {
        if (dto == null) return null;
        Subscription subscription = new Subscription();
        subscription.setName(dto.getName());
        subscription.setEstimatedAmount(dto.getEstimatedAmount());
        subscription.setCurrencyCode(dto.getCurrencyCode() != null ? dto.getCurrencyCode() : "USD");
        if (dto.getFrequency() != null) {
            subscription.setFrequency(Subscription.Frequency.valueOf(dto.getFrequency()));
        }
        subscription.setNextDueDate(dto.getNextDueDate());
        subscription.setTrialEndDate(dto.getTrialEndDate());
        subscription.setCategory(dto.getCategory());
        subscription.setReminderDays(dto.getReminderDays() != null ? dto.getReminderDays() : 3);
        subscription.setNote(dto.getNote());
        if (dto.getStatus() != null) {
            subscription.setStatus(Subscription.SubscriptionStatus.valueOf(dto.getStatus()));
        }
        return subscription;
    }
}
