package com.ecommerce.pricing.dto;

import com.ecommerce.common.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class PriceHistoryDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Grade grade;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private BigDecimal estimatedRevenueImpact;
    private String reasoning;
    private Instant createdAt;
}
