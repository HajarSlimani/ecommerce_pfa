package com.ecommerce.catalogue.repository;

import com.ecommerce.catalogue.entity.ProductUnit;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductUnitRepository extends JpaRepository<ProductUnit, Long> {

    long countByProductIdAndGradeAndColorAndStatus(Long productId, Grade grade, String color, UnitStatus status);

    /**
     * Comptage par grade seul (toutes couleurs confondues) : utilisé par le
     * moteur de pricing, qui raisonne au niveau (produit, grade) et pas par
     * couleur (voir la note dans ProductUnit).
     */
    long countByProductIdAndGradeAndStatus(Long productId, Grade grade, UnitStatus status);

    List<ProductUnit> findByProductIdAndStatus(Long productId, UnitStatus status);

    /** Toutes les unités d'un produit, tous statuts confondus — vue admin. */
    List<ProductUnit> findByProductIdOrderByEnteredStockAtDesc(Long productId);

    /**
     * Sélectionne les N unités disponibles les plus anciennes (FIFO) pour un
     * produit + grade + couleur donnés, avec verrou pessimiste pour éviter la
     * survente en cas de commandes concurrentes sur le même stock.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT u FROM ProductUnit u
            WHERE u.product.id = :productId
              AND u.grade = :grade
              AND u.color = :color
              AND u.status = 'AVAILABLE'
            ORDER BY u.enteredStockAt ASC
            """)
    List<ProductUnit> findAvailableUnitsForUpdate(@Param("productId") Long productId,
                                                    @Param("grade") Grade grade,
                                                    @Param("color") String color);

    @Query("""
            SELECT DISTINCT u.grade FROM ProductUnit u
            WHERE u.product.id = :productId AND u.status = 'AVAILABLE'
            """)
    List<Grade> findAvailableGrades(@Param("productId") Long productId);

    /**
     * Toutes les combinaisons (grade, couleur) actuellement disponibles pour
     * un produit — c'est ce qui alimente le sélecteur de variante côté front.
     */
    @Query("""
            SELECT DISTINCT u.grade as grade, u.color as color FROM ProductUnit u
            WHERE u.product.id = :productId AND u.status = 'AVAILABLE'
            """)
    List<GradeColorProjection> findAvailableVariantCombos(@Param("productId") Long productId);

    interface GradeColorProjection {
        Grade getGrade();
        String getColor();
    }

    /**
     * Produits dont le stock disponible (tous grades/couleurs confondus) est
     * à ou sous le seuil donné — alimente l'alerte "stock faible" du
     * dashboard admin.
     */
    @Query("""
            SELECT u.product.id AS productId, u.product.name AS productName, COUNT(u) AS availableUnits
            FROM ProductUnit u
            WHERE u.status = 'AVAILABLE'
            GROUP BY u.product.id, u.product.name
            HAVING COUNT(u) <= :threshold
            ORDER BY COUNT(u) ASC
            """)
    List<LowStockProjection> findLowStock(@Param("threshold") long threshold);

    interface LowStockProjection {
        Long getProductId();
        String getProductName();
        Long getAvailableUnits();
    }
}
