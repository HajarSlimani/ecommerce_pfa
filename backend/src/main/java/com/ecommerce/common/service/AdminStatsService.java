package com.ecommerce.common.service;

import com.ecommerce.auth.UserRepository;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.commande.repository.OrderItemRepository;
import com.ecommerce.commande.repository.OrderRepository;
import com.ecommerce.common.dto.AdminStatsDTO;
import com.ecommerce.common.dto.CategorySalesDTO;
import com.ecommerce.common.dto.LowStockProductDTO;
import com.ecommerce.common.dto.TopProductDTO;
import com.ecommerce.common.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Statistiques du tableau de bord admin (vue générale, distincte de la page
 * "Pricing Dynamique" qui montre l'impact du moteur de pricing). Traverse
 * plusieurs modules (catalogue/commande/auth), d'où sa place ici plutôt que
 * dans un des services métier existants.
 *
 * Une commande n'est comptée comme "vente" (revenu, top produits, ventes par
 * catégorie) que si son statut est dans PAID_STATUSES — une commande PENDING
 * n'a pas encore été payée, une CANCELLED a vu son stock restauré, ni l'une
 * ni l'autre ne représente une vente réelle.
 */
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private static final List<OrderStatus> PAID_STATUSES =
            List.of(OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public AdminStatsDTO getStats() {
        Instant now = Instant.now();
        Instant weekAgo = now.minus(7, ChronoUnit.DAYS);
        Instant twoWeeksAgo = now.minus(14, ChronoUnit.DAYS);

        BigDecimal revenueThisWeek = orderRepository.sumRevenueBetween(PAID_STATUSES, weekAgo, now);
        BigDecimal revenueLastWeek = orderRepository.sumRevenueBetween(PAID_STATUSES, twoWeeksAgo, weekAgo);
        long ordersThisWeek = orderRepository.countByCreatedAtBetween(weekAgo, now);
        long ordersLastWeek = orderRepository.countByCreatedAtBetween(twoWeeksAgo, weekAgo);
        long usersThisWeek = userRepository.countByCreatedAtBetween(weekAgo, now);
        long usersLastWeek = userRepository.countByCreatedAtBetween(twoWeeksAgo, weekAgo);

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        return AdminStatsDTO.builder()
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .totalUsers(userRepository.count())
                .totalRevenue(orderRepository.sumRevenueBetween(PAID_STATUSES, Instant.EPOCH, now))
                .revenueTrendPct(trendPct(revenueLastWeek, revenueThisWeek))
                .ordersTrendPct(trendPct(BigDecimal.valueOf(ordersLastWeek), BigDecimal.valueOf(ordersThisWeek)))
                .usersTrendPct(trendPct(BigDecimal.valueOf(usersLastWeek), BigDecimal.valueOf(usersThisWeek)))
                .ordersByStatus(ordersByStatus)
                .build();
    }

    /** Null si pas de base de comparaison (évite un "+∞%" absurde). */
    private Double trendPct(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.signum() == 0) {
            return null;
        }
        return current.subtract(previous)
                .divide(previous, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    public List<LowStockProductDTO> getLowStock(long threshold) {
        return productUnitRepository.findLowStock(threshold).stream()
                .map(p -> LowStockProductDTO.builder()
                        .productId(p.getProductId())
                        .productName(p.getProductName())
                        .availableUnits(p.getAvailableUnits())
                        .build())
                .toList();
    }

    public List<TopProductDTO> getTopProducts(int limit) {
        return orderItemRepository.findTopProducts(PAID_STATUSES, PageRequest.of(0, limit)).stream()
                .map(p -> TopProductDTO.builder()
                        .productId(p.getProductId())
                        .productName(p.getProductName())
                        .unitsSold(p.getUnitsSold())
                        .revenue(p.getRevenue())
                        .build())
                .toList();
    }

    public List<CategorySalesDTO> getSalesByCategory() {
        return orderItemRepository.findSalesByCategory(PAID_STATUSES).stream()
                .map(c -> CategorySalesDTO.builder()
                        .category(c.getCategory())
                        .unitsSold(c.getUnitsSold())
                        .revenue(c.getRevenue())
                        .build())
                .toList();
    }
}
