package com.ecommerce.panier.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Rempli pour un panier utilisateur connecté. Null pour un panier invité
     * (identifié alors par guestId). Postgres autorise plusieurs NULL sur une
     * colonne unique, donc pas de conflit entre paniers invités.
     */
    @Column(name = "user_id", unique = true)
    private Long userId;

    /**
     * UUID généré côté navigateur pour un visiteur non connecté, afin qu'il
     * ne perde pas son panier tant qu'il n'est pas prêt à créer un compte.
     * Fusionné dans le panier utilisateur à la connexion/inscription (voir
     * CartService.mergeGuestCartIntoUser).
     */
    @Column(name = "guest_id", unique = true)
    private String guestId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
