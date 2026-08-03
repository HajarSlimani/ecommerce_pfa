package com.ecommerce.pricing.repository;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.pricing.entity.SalesVelocitySnapshot;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SalesVelocitySnapshotRepository extends JpaRepository<SalesVelocitySnapshot, Long> {

    @Query("""
            SELECT s FROM SalesVelocitySnapshot s
            WHERE s.productId = :productId AND s.grade = :grade
            ORDER BY s.windowEnd DESC
            """)
    List<SalesVelocitySnapshot> findRecent(@Param("productId") Long productId,
                                             @Param("grade") Grade grade,
                                             Pageable pageable);

    default Optional<SalesVelocitySnapshot> findLatest(Long productId, Grade grade) {
        List<SalesVelocitySnapshot> results = findRecent(productId, grade, Pageable.ofSize(1));
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
}
