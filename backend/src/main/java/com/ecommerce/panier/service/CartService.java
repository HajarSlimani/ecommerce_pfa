package com.ecommerce.panier.service;

import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.entity.ProductUnit;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.common.enums.UnitStatus;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.panier.dto.AddCartItemRequest;
import com.ecommerce.panier.dto.CartDTO;
import com.ecommerce.panier.dto.CartItemDTO;
import com.ecommerce.panier.entity.Cart;
import com.ecommerce.panier.entity.CartItem;
import com.ecommerce.panier.repository.CartItemRepository;
import com.ecommerce.panier.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Version "simple" du panier (pas de réservation d'unité) : on vérifie juste
 * que le stock disponible couvre la quantité demandée au moment de l'ajout.
 * L'assignation FIFO réelle des ProductUnit se fait à la validation de commande.
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;

    @Transactional
    public CartDTO getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO addItem(Long userId, AddCartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + request.getProductId()));

        long available = productUnitRepository.countByProductIdAndGradeAndStatus(
                product.getId(), request.getGrade(), UnitStatus.AVAILABLE);

        if (available < request.getQuantity()) {
            throw new BadRequestException(
                    "Stock insuffisant pour ce grade (disponible : " + available + ")");
        }

        Cart cart = getOrCreateCart(userId);

        CartItem item = CartItem.builder()
                .cart(cart)
                .productId(product.getId())
                .grade(request.getGrade())
                .quantity(request.getQuantity())
                .build();

        cart.getItems().add(item);
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);

        return toDTO(cart);
    }

    @Transactional
    public CartDTO removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        return toDTO(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(userId).build()));
    }

    private CartDTO toDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::toItemDTO)
                .toList();

        BigDecimal total = itemDTOs.stream()
                .map(CartItemDTO::getSubtotal)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .total(total)
                .build();
    }

    private CartItemDTO toItemDTO(CartItem item) {
        Product product = productRepository.findById(item.getProductId()).orElse(null);

        BigDecimal unitPrice = productUnitRepository.findByProductIdAndStatus(item.getProductId(), UnitStatus.AVAILABLE)
                .stream()
                .filter(u -> u.getGrade() == item.getGrade())
                .map(ProductUnit::getCurrentPrice)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(product != null ? product.getName() : null)
                .grade(item.getGrade())
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .subtotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }
}
