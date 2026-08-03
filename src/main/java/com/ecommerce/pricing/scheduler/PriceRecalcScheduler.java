package com.ecommerce.pricing.scheduler;

import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.pricing.service.PricingOrchestratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PriceRecalcScheduler {

    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;
    private final PricingOrchestratorService pricingOrchestratorService;

    @Value("${app.pricing.scheduler.enabled:true}")
    private boolean enabled;

    /**
     * Parcourt tous les produits et déclenche un recalcul pour chaque grade
     * ayant du stock disponible. Fréquence pilotée par app.pricing.scheduler.cron.
     */
    @Scheduled(cron = "${app.pricing.scheduler.cron}")
    public void recalculateAllPrices() {
        if (!enabled) {
            return;
        }

        log.info("Démarrage du recalcul périodique des prix dynamiques");

        for (Product product : productRepository.findAll()) {
            for (Grade grade : productUnitRepository.findAvailableGrades(product.getId())) {
                try {
                    pricingOrchestratorService.recalculatePrice(product.getId(), grade);
                } catch (Exception e) {
                    log.error("Échec recalcul prix productId={} grade={} : {}",
                            product.getId(), grade, e.getMessage());
                }
            }
        }

        log.info("Recalcul périodique des prix terminé");
    }
}
