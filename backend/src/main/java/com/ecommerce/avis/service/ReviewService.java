package com.ecommerce.avis.service;

import com.ecommerce.auth.User;
import com.ecommerce.auth.UserRepository;
import com.ecommerce.avis.dto.CreateReviewRequest;
import com.ecommerce.avis.dto.RatingSummaryDTO;
import com.ecommerce.avis.dto.ReviewDTO;
import com.ecommerce.avis.dto.ReviewEligibilityDTO;
import com.ecommerce.avis.entity.Review;
import com.ecommerce.avis.repository.ReviewRepository;
import com.ecommerce.commande.repository.OrderItemRepository;
import com.ecommerce.common.dto.PageResponse;
import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    /** Un avis n'est autorisé qu'à partir du moment où la commande a été expédiée. */
    private static final List<OrderStatus> ELIGIBLE_STATUSES = List.of(OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public PageResponse<ReviewDTO> getReviews(Long productId, Pageable pageable) {
        var page = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);

        Map<Long, String> namesByUserId = userRepository.findAllById(
                        page.getContent().stream().map(Review::getUserId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u.getFullName() != null ? u.getFullName() : u.getEmail()));

        return PageResponse.from(page, r -> toDTO(r, namesByUserId.get(r.getUserId())));
    }

    public RatingSummaryDTO getRatingSummary(Long productId) {
        return RatingSummaryDTO.builder()
                .averageRating(Math.round(reviewRepository.averageRating(productId) * 10) / 10.0)
                .reviewCount(reviewRepository.countByProductId(productId))
                .build();
    }

    public ReviewEligibilityDTO getEligibility(Long productId, Long userId) {
        boolean canReview = canReview(productId, userId);
        ReviewDTO existing = reviewRepository.findByProductIdAndUserId(productId, userId)
                .map(r -> toDTO(r, resolveName(userId)))
                .orElse(null);

        return ReviewEligibilityDTO.builder()
                .canReview(canReview)
                .existingReview(existing)
                .build();
    }

    private boolean canReview(Long productId, Long userId) {
        return orderItemRepository.existsShippedOrderForProduct(productId, userId, ELIGIBLE_STATUSES);
    }

    @Transactional
    public ReviewDTO createOrUpdateReview(Long productId, Long userId, CreateReviewRequest request) {
        if (!canReview(productId, userId)) {
            throw new BadRequestException(
                    "Tu dois avoir une commande expédiée de ce produit pour laisser un avis");
        }

        Review review = reviewRepository.findByProductIdAndUserId(productId, userId)
                .orElseGet(() -> Review.builder().productId(productId).userId(userId).build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(Instant.now());

        return toDTO(reviewRepository.save(review), resolveName(userId));
    }

    /** Le propriétaire de l'avis peut le retirer lui-même. */
    @Transactional
    public void deleteOwnReview(Long productId, Long userId) {
        Review review = reviewRepository.findByProductIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun avis à supprimer"));
        reviewRepository.delete(review);
    }

    /** Modération admin : peut retirer n'importe quel avis (contenu inapproprié, etc.). */
    @Transactional
    public void deleteAsAdmin(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Avis introuvable : " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    private String resolveName(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getFullName() != null ? u.getFullName() : u.getEmail())
                .orElse("Utilisateur supprimé");
    }

    private ReviewDTO toDTO(Review review, String userName) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .userName(userName)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
