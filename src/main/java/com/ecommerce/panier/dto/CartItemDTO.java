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
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
