package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "parent_category_id")
    private Long parentCategoryId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "name_vn", length = 100)
    private String nameVn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @Column(length = 50)
    private String icon;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CategoryType {
        expense, income, transfer
    }
}
