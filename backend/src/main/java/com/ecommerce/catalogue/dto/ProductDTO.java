package com.ecommerce.catalogue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
