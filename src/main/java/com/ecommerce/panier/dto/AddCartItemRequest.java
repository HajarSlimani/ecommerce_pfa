package com.ecommerce.panier.dto;

import com.ecommerce.common.enums.Grade;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCartItemRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Grade grade;

    @Min(1)
    private int quantity;
}
