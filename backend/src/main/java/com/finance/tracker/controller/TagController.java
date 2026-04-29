package com.finance.tracker.controller;

import com.finance.tracker.model.Tag;
import com.finance.tracker.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagRepository tagRepository;

    @GetMapping
    public List<Tag> getAll(@RequestHeader("X-User-Id") Long userId) {
        return tagRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Tag> create(@RequestHeader("X-User-Id") Long userId, @RequestBody Tag tag) {
        tag.setUserId(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(tagRepository.save(tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        tagRepository.findById(id).ifPresent(t -> {
            if (t.getUserId().equals(userId)) tagRepository.delete(t);
        });
        return ResponseEntity.noContent().build();
    }
}
