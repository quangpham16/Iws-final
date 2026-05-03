package com.finance.tracker.dto;

import com.finance.tracker.model.Category.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private Long userId;
    private Long parentCategoryId;
    private String name;
    private String nameVn;
    private CategoryType type;
    private String icon;
    private String colorHex;
    private Boolean isActive;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
