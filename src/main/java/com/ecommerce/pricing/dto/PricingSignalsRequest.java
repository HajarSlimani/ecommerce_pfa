package com.ecommerce.pricing.dto;

import com.ecommerce.common.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

/**
 * Payload envoyé au microservice FastAPI pour déclencher un recalcul de prix.
 */
@Getter
@Builder
@AllArgsConstructor
public class PricingSignalsRequest {
    private Long productId;
    private Grade grade;
    private BigDecimal currentPrice;
    private int unitsSoldLast7Days;
    private long availableStock;
    private List<BigDecimal> competitorPrices;
}
