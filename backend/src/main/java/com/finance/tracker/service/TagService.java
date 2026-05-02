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
        Tag tag = tagMapper.toEntity(dto);
        tag.setUserId(userId);
        Tag saved = tagRepository.save(tag);
        return tagMapper.toDTO(saved);
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
