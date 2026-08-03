package com.ecommerce.catalogue.dto;

import com.ecommerce.common.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/**
 * Représente une "variante" achetable = un (Product, grade) avec son prix
 * courant et son stock disponible. C'est ce que le front affiche comme
 * sélecteur de grade sur la fiche produit.
 */
@Getter
@Builder
@AllArgsConstructor
public class VariantDTO {
    private Grade grade;
    private BigDecimal currentPrice;
    private long availableStock;
}
