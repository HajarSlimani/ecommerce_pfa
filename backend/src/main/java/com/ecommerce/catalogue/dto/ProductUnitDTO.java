package com.ecommerce.catalogue.dto;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class ProductUnitDTO {
    private Long id;
    private String serialNumber;
    private Grade grade;
    private String color;
    private UnitStatus status;
    private BigDecimal currentPrice;
    private Instant enteredStockAt;
    private Instant soldAt;
}
