package com.finance.tracker.mapper;

import com.finance.tracker.dto.TagDTO;
import com.finance.tracker.model.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {
    public TagDTO toDTO(Tag tag) {
        if (tag == null) return null;
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setColorHex(tag.getColorHex());
        return dto;
    }

    public Tag toEntity(TagDTO dto) {
        if (dto == null) return null;
        Tag tag = new Tag();
        tag.setName(dto.getName());
        tag.setColorHex(dto.getColorHex());
        return tag;
    }
}
