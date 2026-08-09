package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalProducts;
    private long totalOrders;
    private long pendingOrders;
    private long totalUsers;
}
