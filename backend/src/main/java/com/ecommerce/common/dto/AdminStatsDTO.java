package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalProducts;
    private long totalOrders;
    private long pendingOrders;
    private long totalUsers;
    private BigDecimal totalRevenue;

    /**
     * Variation en % vs les 7 jours précédents (semaine N-1). Null si la
     * semaine précédente n'a aucune donnée (division par zéro évitée plutôt
     * que d'afficher un pourcentage absurde de type "+∞%") — le front
     * affiche alors "Nouveau" plutôt qu'un chiffre.
     */
    private Double revenueTrendPct;
    private Double ordersTrendPct;
    private Double usersTrendPct;

    /** Nombre de commandes par statut (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED). */
    private Map<String, Long> ordersByStatus;
}
