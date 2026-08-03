package com.ecommerce.pricing.service;

import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.entity.ProductUnit;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import com.ecommerce.pricing.client.PricingMLClient;
import com.ecommerce.pricing.dto.PricingDecisionResponse;
import com.ecommerce.pricing.dto.PricingSignalsRequest;
import com.ecommerce.pricing.entity.CompetitorPrice;
import com.ecommerce.pricing.entity.PriceHistory;
import com.ecommerce.pricing.entity.SalesVelocitySnapshot;
import com.ecommerce.pricing.repository.CompetitorPriceRepository;
import com.ecommerce.pricing.repository.PriceHistoryRepository;
import com.ecommerce.pricing.repository.SalesVelocitySnapshotRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PricingOrchestratorService {

    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;
    private final SalesVelocitySnapshotRepository velocityRepository;
    private final CompetitorPriceRepository competitorPriceRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final PricingMLClient pricingMLClient;
    private final ObjectMapper objectMapper;

    /**
     * Recalcule le prix pour un couple (produit, grade) :
     * 1. agrège les signaux (vélocité, stock, concurrence)
     * 2. appelle le microservice FastAPI
     * 3. persiste la décision dans PriceHistory
     * 4. met à jour le prix courant des ProductUnit concernées
     * 5. invalide le cache Redis du produit
     */
    @CacheEvict(value = "productVariants", key = "#productId")
    public void recalculatePrice(Long productId, Grade grade) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produit introuvable : " + productId));

        long availableStock = productUnitRepository.countByProductIdAndGradeAndStatus(
                productId, grade, UnitStatus.AVAILABLE);

        if (availableStock == 0) {
            log.debug("Pas d'unité disponible pour productId={} grade={}, recalcul ignoré", productId, grade);
            return;
        }

        int unitsSoldLast7Days = velocityRepository.findLatest(productId, grade)
                .map(SalesVelocitySnapshot::getUnitsSold)
                .orElse(0);

        List<BigDecimal> competitorPrices = competitorPriceRepository
                .findLatestForProductGrade(productId, grade)
                .stream()
                .map(CompetitorPrice::getPrice)
                .toList();

        BigDecimal currentPrice = productUnitRepository.findByProductIdAndStatus(productId, UnitStatus.AVAILABLE)
                .stream()
                .filter(u -> u.getGrade() == grade)
                .map(ProductUnit::getCurrentPrice)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        PricingSignalsRequest request = PricingSignalsRequest.builder()
                .productId(productId)
                .grade(grade)
                .currentPrice(currentPrice)
                .unitsSoldLast7Days(unitsSoldLast7Days)
                .availableStock(availableStock)
                .competitorPrices(competitorPrices)
                .build();

        PricingDecisionResponse decision = pricingMLClient.computePrice(request).block();

        if (decision == null) {
            log.warn("Aucune décision retournée par le moteur ML pour productId={} grade={}", productId, grade);
            return;
        }

        persistDecision(productId, grade, currentPrice, decision, request);
        applyNewPriceToUnits(productId, grade, decision.getNewPrice());
    }

    private void persistDecision(Long productId, Grade grade, BigDecimal oldPrice,
                                  PricingDecisionResponse decision, PricingSignalsRequest signals) {
        String signalsJson;
        try {
            Map<String, Object> signalsMap = new HashMap<>();
            signalsMap.put("unitsSoldLast7Days", signals.getUnitsSoldLast7Days());
            signalsMap.put("availableStock", signals.getAvailableStock());
            signalsMap.put("competitorPrices", signals.getCompetitorPrices());
            signalsMap.put("reasoning", decision.getReasoning());
            signalsMap.put("confidenceScore", decision.getConfidenceScore());
            signalsJson = objectMapper.writeValueAsString(signalsMap);
        } catch (Exception e) {
            signalsJson = "{}";
        }

        PriceHistory history = PriceHistory.builder()
                .productId(productId)
                .grade(grade)
                .oldPrice(oldPrice)
                .newPrice(decision.getNewPrice())
                .signalsJson(signalsJson)
                .estimatedRevenueImpact(decision.getEstimatedRevenueImpact())
                .build();

        priceHistoryRepository.save(history);
    }

    private void applyNewPriceToUnits(Long productId, Grade grade, BigDecimal newPrice) {
        List<ProductUnit> units = productUnitRepository.findByProductIdAndStatus(productId, UnitStatus.AVAILABLE)
                .stream()
                .filter(u -> u.getGrade() == grade)
                .toList();

        units.forEach(u -> u.setCurrentPrice(newPrice));
        productUnitRepository.saveAll(units);
    }
}
