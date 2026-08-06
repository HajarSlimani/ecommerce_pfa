package com.ecommerce.catalogue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ProductDetailDTO {
    private ProductDTO product;
    private List<VariantDTO> variants;
}
