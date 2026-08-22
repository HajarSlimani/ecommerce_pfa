package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class CategorySalesDTO {
    private String category;
    private long unitsSold;
    private BigDecimal revenue;
}
