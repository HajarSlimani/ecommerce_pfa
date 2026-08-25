package com.ecommerce.avis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userName;
    private int rating;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
}
