package com.ecommerce.catalogue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

/**
 * @NoArgsConstructor + @Setter sont nécessaires même si le code applicatif
 * n'utilise que le @Builder : ce DTO est mis en cache dans Redis via Jackson
 * (GenericJackson2JsonRedisSerializer), qui a besoin d'un constructeur par
 * défaut + de setters pour RECONSTRUIRE l'objet à la lecture du cache.
 * Sans ça, l'écriture en cache fonctionne (via les getters) mais la lecture
 * échoue avec une exception de désérialisation.
 */
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String brand;
    private String category;
    private String imageUrl;

    /**
     * Prix le plus bas parmi les unités disponibles (toutes couleurs, filtré
     * par grade si un grade est demandé). Null si aucune unité disponible.
     * Uniquement renseigné par {@link com.ecommerce.catalogue.service.ProductService#searchProducts}
     * — reste null sur le endpoint /products classique (listing simple, pas
     * de jointure vers les unités) pour ne pas changer son comportement.
     */
    private BigDecimal minPrice;

    /**
     * Photo par couleur (couleur → URL). Absente/vide si le produit n'a que
     * sa photo par défaut (imageUrl). Renseignée sur le endpoint de détail
     * uniquement (pas sur le listing/search, qui n'a pas besoin de ça).
     */
    private Map<String, String> colorImages;
}
