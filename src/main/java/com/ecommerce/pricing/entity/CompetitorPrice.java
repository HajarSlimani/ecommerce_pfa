package com.ecommerce.pricing.entity;

import com.ecommerce.common.enums.Grade;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "competitor_prices", indexes = {
        @Index(name = "idx_competitor_product_grade", columnList = "product_id, grade, collected_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Column(nullable = false)
    private String competitorName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "collected_at", nullable = false)
    private Instant collectedAt = Instant.now();
}
