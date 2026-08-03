package com.ecommerce.pricing.repository;

import com.ecommerce.pricing.entity.PriceHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    Page<PriceHistory> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    @Query("""
            SELECT p FROM PriceHistory p
            WHERE p.createdAt BETWEEN :from AND :to
            ORDER BY p.createdAt DESC
            """)
    List<PriceHistory> findAllBetween(@Param("from") Instant from, @Param("to") Instant to);

    Page<PriceHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
