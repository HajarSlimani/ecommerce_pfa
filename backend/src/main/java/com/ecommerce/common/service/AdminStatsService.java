package com.ecommerce.common.service;

import com.ecommerce.auth.UserRepository;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.commande.repository.OrderRepository;
import com.ecommerce.common.dto.AdminStatsDTO;
import com.ecommerce.common.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Compteurs simples pour le tableau de bord admin (vue générale, distincte
 * de la page "Pricing Dynamique" qui, elle, montre l'impact du moteur de
 * pricing). Traverse plusieurs modules (catalogue/commande/auth), d'où sa
 * place ici plutôt que dans un des services métier existants.
 */
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminStatsDTO getStats() {
        return AdminStatsDTO.builder()
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .totalUsers(userRepository.count())
                .build();
    }
}
