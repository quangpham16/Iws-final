package com.finance.tracker.service;

import com.finance.tracker.dto.TagDTO;
import com.finance.tracker.mapper.TagMapper;
import com.finance.tracker.model.Tag;
import com.finance.tracker.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags(Long userId) {
        return tagRepository.findByUserId(userId).stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TagDTO createTag(Long userId, TagDTO dto) {
        if (dto.getColorHex() != null && !dto.getColorHex().isEmpty() && 
            tagRepository.existsByUserIdAndColorHex(userId, dto.getColorHex())) {
            throw new RuntimeException("Color already exists for another tag");
        }
        Tag tag = tagMapper.toEntity(dto);
        tag.setUserId(userId);
        tag.setCreatedAt(java.time.LocalDateTime.now());
        tag.setUpdatedAt(java.time.LocalDateTime.now());
        Tag saved = tagRepository.save(tag);
        return tagMapper.toDTO(saved);
    }

    @Transactional
    public TagDTO updateTag(Long userId, Long id, TagDTO dto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        if (!tag.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (dto.getColorHex() != null && !dto.getColorHex().isEmpty() && 
            !dto.getColorHex().equals(tag.getColorHex()) &&
            tagRepository.existsByUserIdAndColorHexAndIdNot(userId, dto.getColorHex(), id)) {
            throw new RuntimeException("Color already exists for another tag");
        }
        tag.setName(dto.getName());
        tag.setColorHex(dto.getColorHex());
        tag.setUpdatedAt(java.time.LocalDateTime.now());
        Tag updated = tagRepository.save(tag);
        return tagMapper.toDTO(updated);
    }

    @Transactional
    public void deleteTag(Long userId, Long id) {
        tagRepository.findById(id).ifPresent(t -> {
            if (t.getUserId().equals(userId)) {
                tagRepository.delete(t);
            }
        });
    }
}
