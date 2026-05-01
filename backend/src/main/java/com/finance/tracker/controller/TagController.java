package com.finance.tracker.controller;

import com.finance.tracker.dto.TagDTO;
import com.finance.tracker.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @GetMapping
    public List<TagDTO> getAll(@RequestHeader("X-User-Id") Long userId) {
        return tagService.getAllTags(userId);
    }

    @PostMapping
    public ResponseEntity<TagDTO> create(@RequestHeader("X-User-Id") Long userId, @RequestBody TagDTO tagDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.createTag(userId, tagDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") @NonNull Long userId, @PathVariable @NonNull Long id) {
        tagService.deleteTag(userId, id);
        return ResponseEntity.noContent().build();
    }
}
