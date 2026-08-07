package com.ecommerce.catalogue.repository;

import com.ecommerce.catalogue.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory(String category, Pageable pageable);

    /**
     * Recherche filtrée pour la Boutique : catégorie, grade (au moins une
     * unité disponible de ce grade), texte libre (nom/marque), triée par
     * prix ou nouveauté. Requête native (pas JPQL) car on a besoin d'un
     * ORDER BY piloté par paramètre sur un alias calculé (prix min via CTE),
     * ce que l'ORM ne gère pas bien en JPQL/Pageable classique.
     *
     * Chaque paramètre optionnel (:category, :grade, :search, :sort) est
     * géré via le pattern "(:param IS NULL OR ...)" — passer null plutôt
     * qu'une chaîne vide pour désactiver un filtre (voir
     * ProductService#blankToNull).
     */
    @Query(value = """
            WITH product_min_price AS (
                SELECT product_id, MIN(current_price) AS min_price
                FROM product_units
                WHERE status = 'AVAILABLE'
                  AND (:grade IS NULL OR grade = :grade)
                GROUP BY product_id
            )
            SELECT p.id AS id, p.name AS name, p.description AS description,
                   p.brand AS brand, p.category AS category, p.image_url AS "imageUrl",
                   pmp.min_price AS "minPrice"
            FROM products p
            LEFT JOIN product_min_price pmp ON pmp.product_id = p.id
            WHERE (:category IS NULL OR p.category = :category)
              AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
                                    OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
              AND (:grade IS NULL OR pmp.product_id IS NOT NULL)
            ORDER BY
              CASE WHEN :sort = 'price_asc' THEN pmp.min_price END ASC NULLS LAST,
              CASE WHEN :sort = 'price_desc' THEN pmp.min_price END DESC NULLS LAST,
              CASE WHEN :sort = 'newest' THEN p.created_at END DESC,
              p.id ASC
            """,
            countQuery = """
            WITH product_min_price AS (
                SELECT product_id, MIN(current_price) AS min_price
                FROM product_units
                WHERE status = 'AVAILABLE'
                  AND (:grade IS NULL OR grade = :grade)
                GROUP BY product_id
            )
            SELECT COUNT(*)
            FROM products p
            LEFT JOIN product_min_price pmp ON pmp.product_id = p.id
            WHERE (:category IS NULL OR p.category = :category)
              AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
                                    OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
              AND (:grade IS NULL OR pmp.product_id IS NOT NULL)
            """,
            nativeQuery = true)
    Page<ProductSearchProjection> search(@Param("category") String category,
                                          @Param("grade") String grade,
                                          @Param("search") String search,
                                          @Param("sort") String sort,
                                          Pageable pageable);

    interface ProductSearchProjection {
        Long getId();
        String getName();
        String getDescription();
        String getBrand();
        String getCategory();
        String getImageUrl();
        BigDecimal getMinPrice();
    }
}
