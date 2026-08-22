package com.ecommerce.commande.repository;

import com.ecommerce.commande.entity.Order;
import com.ecommerce.common.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /** Vue admin : toutes les commandes, tous utilisateurs confondus. */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(OrderStatus status);

    long countByCreatedAtBetween(Instant from, Instant to);

    /** Utilisé pour bloquer la suppression d'un utilisateur ayant des commandes. */
    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status IN :statuses AND o.createdAt BETWEEN :from AND :to")
    BigDecimal sumRevenueBetween(@Param("statuses") List<OrderStatus> statuses,
                                  @Param("from") Instant from, @Param("to") Instant to);
}
