package com.ecommerce.avis.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Un avis par (produit, utilisateur) — s'il rachète le même produit plus
 * tard, il met à jour son avis existant plutôt que d'en créer un second
 * (voir ReviewService#createOrUpdateReview). L'éligibilité (a-t-il une
 * commande Expédiée+ pour ce produit) est vérifiée à l'écriture, pas stockée
 * ici : un avis reste affiché même si la commande change de statut plus tard.
 */
@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int rating; // 1 à 5, validé côté DTO

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
