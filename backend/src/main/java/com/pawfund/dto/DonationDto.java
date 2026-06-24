package com.pawfund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationDto {
    private Long id;
    private Long userId;
    private String username;
    private Long shelterId;
    private String shelterName;
    private Long campaignId;
    private String campaignTitle;
    private BigDecimal amount;
    private String message;
    private String createdAt;
}
