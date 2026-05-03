package com.finance.tracker.mapper;

import com.finance.tracker.dto.TagDTO;
import com.finance.tracker.model.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {
    public TagDTO toDTO(Tag tag) {
        if (tag == null) return null;
        return TagDTO.builder()
                .id(tag.getId())
                .userId(tag.getUserId())
                .first(tag.getFirst())
                .last(tag.getLast())
                .name(tag.getName())
                .colorHex(tag.getColorHex())
                .isSystem(tag.getIsSystem())
                .usageCount(tag.getUsageCount())
                .createdAt(tag.getCreatedAt())
                .updatedAt(tag.getUpdatedAt())
                .build();
    }

    public Tag toEntity(TagDTO dto) {
        if (dto == null) return null;
        return Tag.builder()
                .userId(dto.getUserId())
                .first(dto.getFirst())
                .last(dto.getLast())
                .name(dto.getName())
                .colorHex(dto.getColorHex())
                .isSystem(dto.getIsSystem() != null ? dto.getIsSystem() : false)
                .usageCount(dto.getUsageCount() != null ? dto.getUsageCount() : 0L)
                .build();
    }
}
