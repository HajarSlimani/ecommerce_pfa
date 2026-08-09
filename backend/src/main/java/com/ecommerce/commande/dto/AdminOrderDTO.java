package com.ecommerce.commande.dto;

import com.ecommerce.common.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class AdminOrderDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private OrderStatus status;
    private BigDecimal total;
    private int itemCount;
    private Instant createdAt;
}
