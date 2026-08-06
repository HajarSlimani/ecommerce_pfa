package com.ecommerce.catalogue.dto;

import com.ecommerce.common.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Représente une "variante" achetable = un (Product, grade, couleur) avec
 * son prix courant et son stock disponible. C'est ce que le front affiche
 * comme sélecteur sur la fiche produit.
 */
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class VariantDTO {
    private Grade grade;
    private String color;
    private BigDecimal currentPrice;
    private long availableStock;
}
