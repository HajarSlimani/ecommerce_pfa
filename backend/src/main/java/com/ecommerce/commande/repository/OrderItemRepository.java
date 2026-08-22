package com.ecommerce.commande.repository;

import com.ecommerce.commande.entity.OrderItem;
import com.ecommerce.common.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Uniquement les commandes réellement payées (:statuses) — une commande
     * PENDING n'a pas encore été payée, une CANCELLED a vu son stock restauré,
     * ni l'une ni l'autre ne doit compter comme une "vente".
     */
    @Query("""
            SELECT oi.productId AS productId, oi.productName AS productName,
                   COUNT(oi) AS unitsSold, SUM(oi.priceAtPurchase) AS revenue
            FROM OrderItem oi
            WHERE oi.order.status IN :statuses
            GROUP BY oi.productId, oi.productName
            ORDER BY COUNT(oi) DESC
            """)
    List<TopProductProjection> findTopProducts(@Param("statuses") List<OrderStatus> statuses, Pageable pageable);

    @Query("""
            SELECT p.category AS category, COUNT(oi) AS unitsSold, SUM(oi.priceAtPurchase) AS revenue
            FROM OrderItem oi JOIN com.ecommerce.catalogue.entity.Product p ON p.id = oi.productId
            WHERE oi.order.status IN :statuses
            GROUP BY p.category
            ORDER BY SUM(oi.priceAtPurchase) DESC
            """)
    List<CategorySalesProjection> findSalesByCategory(@Param("statuses") List<OrderStatus> statuses);

    interface TopProductProjection {
        Long getProductId();
        String getProductName();
        Long getUnitsSold();
        BigDecimal getRevenue();
    }

    interface CategorySalesProjection {
        String getCategory();
        Long getUnitsSold();
        BigDecimal getRevenue();
    }
}
