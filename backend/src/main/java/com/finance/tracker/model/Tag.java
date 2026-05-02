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

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "color_hex", length = 7)
    private String colorHex;
}
