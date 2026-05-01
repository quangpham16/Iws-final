package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payee_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    private String website;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
