package com.ecommerce.catalogue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProductDetailDTO {
    private ProductDTO product;
    private List<VariantDTO> variants;
}
