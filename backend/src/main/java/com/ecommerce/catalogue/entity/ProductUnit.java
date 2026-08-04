package com.ecommerce.catalogue.entity;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Unité physique d'un produit (ex: un iPhone précis identifié par son numéro de série).
 * C'est la classe centrale pour la logique de stock et de pricing par grade :
 * un même Product peut avoir plusieurs ProductUnit de grades différents,
 * chacune avec son propre prix courant et son propre statut.
 */
@Entity
@Table(name = "product_units", indexes = {
        @Index(name = "idx_unit_product_grade_status", columnList = "product_id, grade, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UnitStatus status = UnitStatus.AVAILABLE;

    /**
     * Prix courant, dénormalisé depuis PriceHistory pour des lectures rapides
     * (catalogue, panier) sans jointure vers l'historique complet.
     * Mis à jour à chaque recalcul par le moteur de pricing.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "entered_stock_at", nullable = false)
    @Builder.Default
    private Instant enteredStockAt = Instant.now();

    private Instant soldAt;
}
