package com.ecommerce.avis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RatingSummaryDTO {
    private double averageRating;
    private long reviewCount;
}
