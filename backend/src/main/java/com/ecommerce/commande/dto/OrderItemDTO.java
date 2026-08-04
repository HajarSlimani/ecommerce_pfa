package com.ecommerce.commande.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class OrderItemDTO {
    private Long productId;
    private String productName;
    private Long productUnitId;
    private BigDecimal priceAtPurchase;
}
