package com.ecommerce.avis.controller;

import com.ecommerce.avis.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Modération : un admin peut retirer un avis inapproprié. */
@RestController
@RequestMapping("/api/admin/reviews")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteAsAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
