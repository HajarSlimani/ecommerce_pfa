package com.ecommerce.commande.controller;

import com.ecommerce.auth.UserPrincipal;
import com.ecommerce.commande.dto.OrderDTO;
import com.ecommerce.commande.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> checkout(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.checkout(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id, principal));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderDTO>> getOrdersForUser(@AuthenticationPrincipal UserPrincipal principal,
                                                            @PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersForUser(userId, principal, pageable));
    }
}
