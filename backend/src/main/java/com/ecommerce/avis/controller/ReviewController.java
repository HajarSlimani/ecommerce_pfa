package com.ecommerce.avis.controller;

import com.ecommerce.auth.UserPrincipal;
import com.ecommerce.avis.dto.CreateReviewRequest;
import com.ecommerce.avis.dto.RatingSummaryDTO;
import com.ecommerce.avis.dto.ReviewDTO;
import com.ecommerce.avis.dto.ReviewEligibilityDTO;
import com.ecommerce.avis.service.ReviewService;
import com.ecommerce.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Public : n'importe qui peut lire les avis, même déconnecté. */
    @GetMapping
    public ResponseEntity<PageResponse<ReviewDTO>> getReviews(@PathVariable Long productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviews(productId, pageable));
    }

    @GetMapping("/summary")
    public ResponseEntity<RatingSummaryDTO> getSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(productId));
    }

    /** Connecté uniquement : dit au front si le bouton "Laisser un avis" doit s'afficher. */
    @GetMapping("/eligibility")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewEligibilityDTO> getEligibility(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getEligibility(productId, principal.getId()));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDTO> createOrUpdateReview(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long productId,
                                                           @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createOrUpdateReview(productId, principal.getId(), request));
    }

    @DeleteMapping("/me")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteOwnReview(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long productId) {
        reviewService.deleteOwnReview(productId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
