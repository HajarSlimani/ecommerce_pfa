package com.ecommerce.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Réponse du microservice FastAPI : nouveau prix + justification.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricingDecisionResponse {
    private BigDecimal newPrice;
    private BigDecimal estimatedRevenueImpact;
    private String reasoning;
    private double confidenceScore;
}
