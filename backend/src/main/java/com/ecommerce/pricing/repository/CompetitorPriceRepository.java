package com.ecommerce.pricing.repository;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.pricing.entity.CompetitorPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompetitorPriceRepository extends JpaRepository<CompetitorPrice, Long> {

    @Query("""
            SELECT c FROM CompetitorPrice c
            WHERE c.productId = :productId AND c.grade = :grade
            ORDER BY c.collectedAt DESC
            """)
    List<CompetitorPrice> findLatestForProductGrade(@Param("productId") Long productId,
                                                      @Param("grade") Grade grade);
}
