package com.ecommerce.avis.repository;

import com.ecommerce.avis.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.productId = :productId")
    double averageRating(@Param("productId") Long productId);

    long countByProductId(Long productId);
}
