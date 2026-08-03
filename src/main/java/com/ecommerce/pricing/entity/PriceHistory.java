package com.ecommerce.pricing.entity;

import com.ecommerce.common.enums.Grade;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Historise chaque décision de prix prise par le moteur ML pour un couple
 * (produit, grade). C'est la table sur laquelle s'appuie le dashboard admin
 * pour l'historique des ajustements et le calcul d'impact revenu.
 */
@Entity
@Table(name = "price_history", indexes = {
        @Index(name = "idx_price_history_product_grade", columnList = "product_id, grade, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal oldPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal newPrice;

    /**
     * Snapshot JSON des signaux utilisés par le modèle ML pour cette décision
     * (vélocité, stock, prix concurrents) — utile pour l'explicabilité affichée
     * dans le dashboard ("pourquoi ce prix a changé").
     */
    @Column(columnDefinition = "TEXT")
    private String signalsJson;

    /**
     * Impact revenu estimé par le moteur ML pour cet ajustement
     * (peut être positif ou négatif).
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedRevenueImpact;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
