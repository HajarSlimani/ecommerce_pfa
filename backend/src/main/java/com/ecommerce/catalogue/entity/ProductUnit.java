package com.ecommerce.catalogue.entity;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Unité physique d'un produit (ex: un iPhone précis identifié par son numéro de série).
 * C'est la classe centrale pour la logique de stock : un même Product peut
 * avoir plusieurs ProductUnit de grades ET de couleurs différentes. Le prix,
 * lui, reste piloté par grade uniquement (pas par couleur) : les unités de
 * même grade partagent le même currentPrice quelle que soit leur couleur.
 */
@Entity
@Table(name = "product_units", indexes = {
        @Index(name = "idx_unit_product_grade_color_status", columnList = "product_id, grade, color, status")
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

    @Column(nullable = false)
    private String color;

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
