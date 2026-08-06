package com.ecommerce.catalogue.dto;

import com.ecommerce.common.enums.Grade;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateProductUnitRequest {

    @NotBlank
    private String serialNumber;

    @NotNull
    private Grade grade;

    @NotBlank
    private String color;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal currentPrice;
}
