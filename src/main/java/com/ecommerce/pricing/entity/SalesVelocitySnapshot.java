package com.ecommerce.pricing.entity;

import com.ecommerce.common.enums.Grade;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Agrège le nombre d'unités vendues sur une fenêtre glissante pour un
 * couple (produit, grade). C'est l'un des signaux d'entrée du moteur ML
 * FastAPI pour estimer la "vélocité des ventes".
 */
@Entity
@Table(name = "sales_velocity_snapshots", indexes = {
        @Index(name = "idx_velocity_product_grade_window", columnList = "product_id, grade, window_end")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesVelocitySnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(name = "window_start", nullable = false)
    private Instant windowStart;

    @Column(name = "window_end", nullable = false)
    private Instant windowEnd;

    @Column(nullable = false)
    private Integer unitsSold;
}
