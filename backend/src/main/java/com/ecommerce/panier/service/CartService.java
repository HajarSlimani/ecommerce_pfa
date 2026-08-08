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
 *
 * Supporte aussi les paniers "invités" (utilisateur non connecté), identifiés
 * par un guestId généré côté navigateur, pour ne pas perdre le panier avant
 * la création d'un compte. Voir mergeGuestCartIntoUser pour la fusion à la
 * connexion/inscription.
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;

    @Transactional
    public CartDTO getCart(Long userId, String guestId) {
        Cart cart = resolveCart(userId, guestId);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO addItem(Long userId, String guestId, AddCartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + request.getProductId()));

        Cart cart = resolveCart(userId, guestId);

        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(product.getId())
                        && i.getGrade() == request.getGrade()
                        && i.getColor().equals(request.getColor()))
                .findFirst()
                .orElse(null);

        int alreadyInCart = existingItem != null ? existingItem.getQuantity() : 0;
        int desiredTotalQuantity = alreadyInCart + request.getQuantity();

        long available = productUnitRepository.countByProductIdAndGradeAndColorAndStatus(
                product.getId(), request.getGrade(), request.getColor(), UnitStatus.AVAILABLE);

        if (available < desiredTotalQuantity) {
            throw new BadRequestException(
                    "Stock insuffisant pour cette variante (disponible : " + available + ")");
        }

        if (existingItem != null) {
            // même produit + grade + couleur déjà présents : on incrémente la
            // quantité au lieu de créer une ligne dupliquée dans le panier
            existingItem.setQuantity(desiredTotalQuantity);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .productId(product.getId())
                    .grade(request.getGrade())
                    .color(request.getColor())
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);

        return toDTO(cart);
    }

    @Transactional
    public CartDTO removeItem(Long userId, String guestId, Long itemId) {
        Cart cart = resolveCart(userId, guestId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        return toDTO(cart);
    }

    /**
     * Change la quantité d'un article déjà présent dans le panier (au lieu
     * de devoir le retirer puis le rajouter). Revalide le stock disponible,
     * comme addItem.
     */
    @Transactional
    public CartDTO updateItemQuantity(Long userId, String guestId, Long itemId, int quantity) {
        Cart cart = resolveCart(userId, guestId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Article introuvable dans le panier : " + itemId));

        long available = productUnitRepository.countByProductIdAndGradeAndColorAndStatus(
                item.getProductId(), item.getGrade(), item.getColor(), UnitStatus.AVAILABLE);

        if (available < quantity) {
            throw new BadRequestException(
                    "Stock insuffisant pour cette variante (disponible : " + available + ")");
        }

        item.setQuantity(quantity);
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        return toDTO(cart);
    }

    /**
     * Fusionne le panier invité (s'il existe) dans le panier de l'utilisateur
     * qui vient de se connecter/s'inscrire. Les lignes identiques (même
     * produit+grade+couleur) voient leurs quantités additionnées. Le panier
     * invité est ensuite supprimé.
     */
    @Transactional
    public void mergeGuestCartIntoUser(String guestId, Long userId) {
        if (guestId == null || guestId.isBlank()) {
            return;
        }

        Cart guestCart = cartRepository.findByGuestId(guestId).orElse(null);
        if (guestCart == null || guestCart.getItems().isEmpty()) {
            if (guestCart != null) {
                cartRepository.delete(guestCart);
            }
            return;
        }

        Cart userCart = getOrCreateCartForUser(userId);

        for (CartItem guestItem : guestCart.getItems()) {
            CartItem existing = userCart.getItems().stream()
                    .filter(i -> i.getProductId().equals(guestItem.getProductId())
                            && i.getGrade() == guestItem.getGrade()
                            && i.getColor().equals(guestItem.getColor()))
                    .findFirst()
                    .orElse(null);

            if (existing != null) {
                existing.setQuantity(existing.getQuantity() + guestItem.getQuantity());
            } else {
                userCart.getItems().add(CartItem.builder()
                        .cart(userCart)
                        .productId(guestItem.getProductId())
                        .grade(guestItem.getGrade())
                        .color(guestItem.getColor())
                        .quantity(guestItem.getQuantity())
                        .build());
            }
        }

        userCart.setUpdatedAt(Instant.now());
        cartRepository.save(userCart);
        cartRepository.delete(guestCart);
    }

    private Cart resolveCart(Long userId, String guestId) {
        if (userId != null) {
            return getOrCreateCartForUser(userId);
        }
        if (guestId != null && !guestId.isBlank()) {
            return cartRepository.findByGuestId(guestId)
                    .orElseGet(() -> cartRepository.save(Cart.builder().guestId(guestId).build()));
        }
        throw new BadRequestException("Identifiant de panier manquant (ni utilisateur connecté, ni panier invité)");
    }

    private Cart getOrCreateCartForUser(Long userId) {
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
                .filter(u -> u.getGrade() == item.getGrade() && u.getColor().equals(item.getColor()))
                .map(ProductUnit::getCurrentPrice)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        long availableStock = productUnitRepository.countByProductIdAndGradeAndColorAndStatus(
                item.getProductId(), item.getGrade(), item.getColor(), UnitStatus.AVAILABLE);

        String imageUrl = product != null
                ? product.getColorImages().getOrDefault(item.getColor(), product.getImageUrl())
                : null;

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(product != null ? product.getName() : null)
                .grade(item.getGrade())
                .color(item.getColor())
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .subtotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                .imageUrl(imageUrl)
                .availableStock(availableStock)
                .build();
    }
}
