package com.ecommerce.commande.repository;

import com.ecommerce.commande.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /** Vue admin : toutes les commandes, tous utilisateurs confondus. */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(com.ecommerce.common.enums.OrderStatus status);
}
