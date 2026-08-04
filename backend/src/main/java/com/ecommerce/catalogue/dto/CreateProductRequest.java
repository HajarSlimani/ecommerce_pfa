package com.ecommerce.catalogue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProductRequest {

    @NotBlank
    private String name;

    private String description;
    private String brand;

    @NotBlank
    private String category;

    private String imageUrl;
}
