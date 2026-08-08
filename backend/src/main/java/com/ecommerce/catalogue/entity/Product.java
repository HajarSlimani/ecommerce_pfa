package com.ecommerce.catalogue.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String brand;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Photo par couleur, en complément de imageUrl (photo par défaut/produit).
     * Le grade n'affecte pas la photo (un iPhone Grade A et Grade B de la
     * même couleur se ressemblent visuellement) — seule la couleur compte,
     * d'où une correspondance couleur → URL plutôt qu'un champ par unité
     * (qui obligerait à ressaisir la même image pour chaque unité en stock).
     * Couleur absente de la map → on retombe sur imageUrl côté front.
     */
    @ElementCollection
    @CollectionTable(name = "product_color_images", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "color")
    @Column(name = "image_url")
    @Builder.Default
    private Map<String, String> colorImages = new HashMap<>();

    @Builder.Default
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductUnit> units = new ArrayList<>();
}
