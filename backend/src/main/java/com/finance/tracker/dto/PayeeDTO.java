package com.finance.tracker.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PayeeDTO {
    private Long id;
    private String name;
    private String website;
    private String notes;
    private LocalDateTime createdAt;
}
