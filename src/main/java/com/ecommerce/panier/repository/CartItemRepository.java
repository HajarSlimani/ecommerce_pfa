package com.ecommerce.panier.repository;

import com.ecommerce.panier.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
