package com.finance.tracker.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String type;
    private String icon;
    private String colorHex;
    private Boolean isSystem;
    private LocalDateTime createdAt;
}
