package com.ecommerce.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Comparaison scénario statique (prix inchangés) vs scénario dynamique
 * (pricing piloté par l'IA) sur une période donnée, pour le dashboard admin.
 */
@Getter
@Builder
@AllArgsConstructor
public class RevenueImpactSummaryDTO {
    private Instant from;
    private Instant to;
    private int totalAdjustments;
    private BigDecimal totalEstimatedRevenueImpact;
    private BigDecimal averageImpactPerAdjustment;
}
