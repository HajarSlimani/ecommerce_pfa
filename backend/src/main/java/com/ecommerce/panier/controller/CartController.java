package com.ecommerce.panier.controller;

import com.ecommerce.auth.UserPrincipal;
import com.ecommerce.panier.dto.AddCartItemRequest;
import com.ecommerce.panier.dto.CartDTO;
import com.ecommerce.panier.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Accessible sans authentification (voir SecurityConfig, /api/cart/** est
 * permitAll) : un visiteur non connecté peut avoir un panier identifié par
 * le header X-Guest-Cart-Id (UUID généré côté navigateur), pour ne pas le
 * perdre avant de créer un compte. Si l'utilisateur EST connecté, son userId
 * (extrait du JWT) prime toujours sur le guestId.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private static final String GUEST_HEADER = "X-Guest-Cart-Id";

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestHeader(value = GUEST_HEADER, required = false) String guestId) {
        return ResponseEntity.ok(cartService.getCart(userIdOf(principal), guestId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestHeader(value = GUEST_HEADER, required = false) String guestId,
                                            @Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(userIdOf(principal), guestId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestHeader(value = GUEST_HEADER, required = false) String guestId,
                                               @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(userIdOf(principal), guestId, itemId));
    }

    private Long userIdOf(UserPrincipal principal) {
        return principal != null ? principal.getId() : null;
    }
}
