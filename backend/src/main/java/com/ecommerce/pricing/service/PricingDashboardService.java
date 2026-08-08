package com.ecommerce.pricing.service;

import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.pricing.dto.PriceHistoryDTO;
import com.ecommerce.pricing.dto.RevenueImpactSummaryDTO;
import com.ecommerce.pricing.entity.PriceHistory;
import com.ecommerce.pricing.repository.PriceHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PricingDashboardService {

    private final PriceHistoryRepository priceHistoryRepository;
    private final ProductRepository productRepository;
    private final PricingOrchestratorService pricingOrchestratorService;
    private final ObjectMapper objectMapper;

    public com.ecommerce.common.dto.PageResponse<PriceHistoryDTO> getHistory(Long productId, Pageable pageable) {
        Page<PriceHistory> page = (productId != null)
                ? priceHistoryRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable)
                : priceHistoryRepository.findAllByOrderByCreatedAtDesc(pageable);

        Map<Long, String> productNames = productRepository.findAllById(
                        page.getContent().stream().map(PriceHistory::getProductId).distinct().toList())
                .stream()
                .collect(java.util.stream.Collectors.toMap(Product::getId, Product::getName));

        return com.ecommerce.common.dto.PageResponse.from(page, h -> toDTO(h, productNames.get(h.getProductId())));
    }

    /**
     * NOTE méthodologique : l'impact revenu est ici la somme des estimations
     * produites par le microservice ML à chaque ajustement (estimatedRevenueImpact).
     * Ce n'est pas un a-posteriori calculé sur les ventes réelles ; c'est une
     * projection au moment de la décision. Pour un calcul a-posteriori précis,
     * il faudrait croiser avec OrderItem.priceAtPurchase sur la période.
     */
    public RevenueImpactSummaryDTO getRevenueImpact(Instant from, Instant to) {
        List<PriceHistory> entries = priceHistoryRepository.findAllBetween(from, to);

        BigDecimal total = entries.stream()
                .map(PriceHistory::getEstimatedRevenueImpact)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal average = entries.isEmpty()
                ? BigDecimal.ZERO
                : total.divide(BigDecimal.valueOf(entries.size()), 2, RoundingMode.HALF_UP);

        return RevenueImpactSummaryDTO.builder()
                .from(from)
                .to(to)
                .totalAdjustments(entries.size())
                .totalEstimatedRevenueImpact(total)
                .averageImpactPerAdjustment(average)
                .build();
    }

    public void triggerManualRecalculation(Long productId, Grade grade) {
        pricingOrchestratorService.recalculatePrice(productId, grade);
    }

    private PriceHistoryDTO toDTO(PriceHistory h, String productName) {
        String reasoning = null;
        try {
            JsonNode node = objectMapper.readTree(h.getSignalsJson());
            if (node.has("reasoning")) {
                reasoning = node.get("reasoning").asText();
            }
        } catch (Exception ignored) {
            // signalsJson absent ou invalide, on laisse reasoning à null
        }

        return PriceHistoryDTO.builder()
                .id(h.getId())
                .productId(h.getProductId())
                .productName(productName)
                .grade(h.getGrade())
                .oldPrice(h.getOldPrice())
                .newPrice(h.getNewPrice())
                .estimatedRevenueImpact(h.getEstimatedRevenueImpact())
                .reasoning(reasoning)
                .createdAt(h.getCreatedAt())
                .build();
    }
}
