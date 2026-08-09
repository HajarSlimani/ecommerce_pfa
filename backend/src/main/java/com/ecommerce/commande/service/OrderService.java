package com.ecommerce.commande.service;

import com.ecommerce.auth.UserPrincipal;
import com.ecommerce.auth.UserRepository;
import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.entity.ProductUnit;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.commande.dto.OrderDTO;
import com.ecommerce.commande.dto.OrderItemDTO;
import com.ecommerce.commande.entity.Order;
import com.ecommerce.commande.entity.OrderItem;
import com.ecommerce.commande.repository.OrderRepository;
import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.enums.Role;
import com.ecommerce.common.enums.UnitStatus;
import com.ecommerce.common.exception.ConflictException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.panier.entity.Cart;
import com.ecommerce.panier.entity.CartItem;
import com.ecommerce.panier.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CacheManager cacheManager;

    /**
     * Transforme le panier de l'utilisateur en commande.
     * L'assignation des unités précises (FIFO) se fait ICI, au moment de la
     * commande, avec verrou pessimiste (voir ProductUnitRepository), pour
     * éviter que deux clients se voient attribuer la même unité en cas de
     * requêtes concurrentes sur un stock limité.
     */
    @Transactional
    public OrderDTO checkout(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Panier introuvable pour cet utilisateur"));

        if (cart.getItems().isEmpty()) {
            throw new ConflictException("Le panier est vide");
        }

        Order order = Order.builder()
                .userId(userId)
                .status(OrderStatus.PENDING)
                .total(BigDecimal.ZERO)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        Set<Long> affectedProductIds = new HashSet<>();

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + cartItem.getProductId()));

            // Verrou pessimiste : bloque les lignes sélectionnées jusqu'à la fin
            // de la transaction pour empêcher une autre commande concurrente
            // de piocher dans les mêmes unités.
            List<ProductUnit> candidates = productUnitRepository.findAvailableUnitsForUpdate(
                    product.getId(), cartItem.getGrade(), cartItem.getColor());

            if (candidates.size() < cartItem.getQuantity()) {
                throw new ConflictException(
                        "Stock insuffisant pour " + product.getName() + " (grade " + cartItem.getGrade()
                                + ", couleur " + cartItem.getColor() + ")");
            }

            List<ProductUnit> assigned = candidates.subList(0, cartItem.getQuantity());

            for (ProductUnit unit : assigned) {
                unit.setStatus(UnitStatus.SOLD);
                unit.setSoldAt(Instant.now());
                productUnitRepository.save(unit);

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .productUnitId(unit.getId())
                        .productId(product.getId())
                        .productName(product.getName())
                        .priceAtPurchase(unit.getCurrentPrice())
                        .build();

                orderItems.add(orderItem);
                total = total.add(unit.getCurrentPrice());
            }

            affectedProductIds.add(product.getId());
        }

        order.setItems(orderItems);
        order.setTotal(total);
        order.setStatus(OrderStatus.CONFIRMED);
        Order saved = orderRepository.save(order);

        // Vider le panier une fois la commande confirmée
        cart.getItems().clear();
        cartRepository.save(cart);

        // Le stock vient de changer (unités passées à SOLD) : sans ça, la fiche
        // produit continuerait d'afficher l'ancien stock jusqu'à expiration du
        // TTL du cache Redis (jusqu'à 2 min), alors que la vente vient d'avoir lieu.
        evictProductVariantsCache(affectedProductIds);

        return toDTO(saved);
    }

    @Transactional
    public OrderDTO getOrder(Long orderId, UserPrincipal principal) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable : " + orderId));

        assertOwnerOrAdmin(order.getUserId(), principal);

        return toDTO(order);
    }

    @Transactional
    public com.ecommerce.common.dto.PageResponse<OrderDTO> getOrdersForUser(Long userId, UserPrincipal principal, Pageable pageable) {
        assertOwnerOrAdmin(userId, principal);

        return com.ecommerce.common.dto.PageResponse.from(
                orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable), this::toDTO);
    }

    /** Vue admin : toutes les commandes, tous utilisateurs confondus. */
    public com.ecommerce.common.dto.PageResponse<com.ecommerce.commande.dto.AdminOrderDTO> getAllOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);

        Map<Long, String> emailsByUserId = userRepository.findAllById(
                        page.getContent().stream().map(Order::getUserId).distinct().toList())
                .stream()
                .collect(java.util.stream.Collectors.toMap(com.ecommerce.auth.User::getId, com.ecommerce.auth.User::getEmail));

        return com.ecommerce.common.dto.PageResponse.from(page, order -> com.ecommerce.commande.dto.AdminOrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userEmail(emailsByUserId.getOrDefault(order.getUserId(), "—"))
                .status(order.getStatus())
                .total(order.getTotal())
                .itemCount(order.getItems().size())
                .createdAt(order.getCreatedAt())
                .build());
    }

    /**
     * Transitions autorisées uniquement — évite qu'un admin ne remette par
     * erreur une commande livrée en "en attente", par exemple. CANCELLED
     * n'est atteignable que depuis PENDING/CONFIRMED (pas de retour en
     * arrière après expédition, ça passerait par un retour produit, pas
     * une simple annulation).
     */
    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED),
            OrderStatus.DELIVERED, Set.of(),
            OrderStatus.CANCELLED, Set.of()
    );

    @Transactional
    public OrderDTO updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable : " + orderId));

        OrderStatus current = order.getStatus();
        if (current == newStatus) {
            return toDTO(order);
        }
        if (!ALLOWED_TRANSITIONS.getOrDefault(current, Set.of()).contains(newStatus)) {
            throw new ConflictException("Transition invalide : " + current + " → " + newStatus);
        }

        // Une annulation remet les unités vendues en stock disponible — sans
        // ça, l'annulation "perdrait" ces unités : elles resteraient SOLD
        // pour toujours alors qu'aucune vente n'a réellement abouti.
        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                productUnitRepository.findById(item.getProductUnitId()).ifPresent(unit -> {
                    unit.setStatus(UnitStatus.AVAILABLE);
                    unit.setSoldAt(null);
                    productUnitRepository.save(unit);
                });
            }
            Set<Long> affectedProductIds = order.getItems().stream()
                    .map(OrderItem::getProductId)
                    .collect(java.util.stream.Collectors.toSet());
            evictProductVariantsCache(affectedProductIds);
        }

        order.setStatus(newStatus);
        return toDTO(orderRepository.save(order));
    }

    /**
     * Empêche un utilisateur de consulter la commande / l'historique d'un
     * autre utilisateur simplement en changeant l'id dans l'URL (faille IDOR).
     * Les ADMIN peuvent tout consulter.
     */
    private void assertOwnerOrAdmin(Long resourceOwnerUserId, UserPrincipal principal) {
        boolean isOwner = principal.getId().equals(resourceOwnerUserId);
        boolean isAdmin = principal.getUser().getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Vous n'avez pas accès à cette ressource");
        }
    }

    private void evictProductVariantsCache(Set<Long> productIds) {
        Cache cache = cacheManager.getCache("productVariants");
        if (cache != null) {
            productIds.forEach(cache::evict);
        }
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(i -> OrderItemDTO.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .productUnitId(i.getProductUnitId())
                        .priceAtPurchase(i.getPriceAtPurchase())
                        .build())
                .toList();

        return OrderDTO.builder()
                .id(order.getId())
                .status(order.getStatus())
                .total(order.getTotal())
                .items(itemDTOs)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
