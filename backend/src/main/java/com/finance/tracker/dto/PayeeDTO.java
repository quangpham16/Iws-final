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
public class PayeeDTO {
    private Long id;
    private Long userId;
    private String name;
    private String website;
    private String notes;
    private LocalDateTime createdAt;
}
