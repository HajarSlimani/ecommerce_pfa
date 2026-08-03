package com.ecommerce.commande.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Référence directement une ProductUnit précise (unité sérialisée vendue),
 * pas juste un productId + quantité, pour garder la traçabilité complète.
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_unit_id", nullable = false)
    private Long productUnitId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    /**
     * Prix figé au moment de l'achat, indépendant des futures évolutions
     * du pricing dynamique sur ce produit.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;
}
