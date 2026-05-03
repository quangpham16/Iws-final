package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private Long userId;
    private String first;
    private String last;
    private String name;
    private String colorHex;
    private Boolean isSystem;
    private Long usageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
