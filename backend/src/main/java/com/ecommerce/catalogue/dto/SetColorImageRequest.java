package com.ecommerce.catalogue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetColorImageRequest {

    @NotBlank
    private String color;

    @NotBlank
    private String imageUrl;
}
