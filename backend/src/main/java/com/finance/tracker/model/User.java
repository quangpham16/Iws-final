package com.finance.tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String password; // In a real app, this should be hashed

    @Column(name = "full_name")
    private String fullName;

    @Builder.Default
    @Column(name = "base_currency_code")
    private String baseCurrencyCode = "VND";

    @Builder.Default
    @Column(name = "timezone")
    private String timezone = "Asia/Ho_Chi_Minh";

    @Builder.Default
    @Column(name = "locale")
    private String locale = "vi_VN";

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.active;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Profile fields
    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "phone_country_code")
    private String phoneCountryCode = "VN";

    @Column(name = "gender")
    private String gender;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "tax_id_number")
    private String taxIdNumber;

    @Column(name = "tax_country_code")
    private String taxCountryCode;

    @Column(name = "residential_address")
    private String residentialAddress;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum UserStatus {
        active, inactive, suspended
    }
}
