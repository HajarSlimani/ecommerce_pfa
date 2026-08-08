package com.ecommerce.panier.dto;

import com.ecommerce.common.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Grade grade;
    private String color;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    /** Photo de la couleur choisie, avec repli sur la photo par défaut du produit. */
    private String imageUrl;

    /** Stock disponible pour ce (produit, grade, couleur) — plafond du sélecteur de quantité côté front. */
    private long availableStock;
}
