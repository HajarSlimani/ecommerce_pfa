package com.ecommerce.commande.dto;

import com.ecommerce.common.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private OrderStatus status;
    private BigDecimal total;
    private List<OrderItemDTO> items;
    private Instant createdAt;
}
