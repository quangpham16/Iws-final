package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first", length = 100)
    private String first;

    @Column(name = "last", length = 100)
    private String last;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "is_system")
    private Boolean isSystem = false;

    @Column(name = "usage_count")
    private Long usageCount = 0L;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
}
