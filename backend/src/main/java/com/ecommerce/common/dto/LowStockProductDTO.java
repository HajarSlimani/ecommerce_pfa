package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LowStockProductDTO {
    private Long productId;
    private String productName;
    private long availableUnits;
}
