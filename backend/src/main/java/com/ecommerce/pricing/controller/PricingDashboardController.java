package com.ecommerce.pricing.controller;

import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.dto.PageResponse;
import com.ecommerce.pricing.dto.PriceHistoryDTO;
import com.ecommerce.pricing.dto.RevenueImpactSummaryDTO;
import com.ecommerce.pricing.service.PricingDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/pricing")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class PricingDashboardController {

    private final PricingDashboardService pricingDashboardService;

    @GetMapping("/history")
    public ResponseEntity<PageResponse<PriceHistoryDTO>> getHistory(
            @RequestParam(required = false) Long productId,
            Pageable pageable) {
        return ResponseEntity.ok(pricingDashboardService.getHistory(productId, pageable));
    }

    @GetMapping("/impact")
    public ResponseEntity<RevenueImpactSummaryDTO> getImpact(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ResponseEntity.ok(pricingDashboardService.getRevenueImpact(from, to));
    }

    @PostMapping("/recalculate/{productId}")
    public ResponseEntity<Void> recalculate(@PathVariable Long productId, @RequestParam Grade grade) {
        pricingDashboardService.triggerManualRecalculation(productId, grade);
        return ResponseEntity.accepted().build();
    }
}
