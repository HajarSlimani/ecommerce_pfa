package com.ecommerce.common.controller;

import com.ecommerce.common.dto.AdminStatsDTO;
import com.ecommerce.common.dto.CategorySalesDTO;
import com.ecommerce.common.dto.LowStockProductDTO;
import com.ecommerce.common.dto.TopProductDTO;
import com.ecommerce.common.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getStats());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<LowStockProductDTO>> getLowStock(
            @RequestParam(defaultValue = "3") long threshold) {
        return ResponseEntity.ok(adminStatsService.getLowStock(threshold));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminStatsService.getTopProducts(limit));
    }

    @GetMapping("/sales-by-category")
    public ResponseEntity<List<CategorySalesDTO>> getSalesByCategory() {
        return ResponseEntity.ok(adminStatsService.getSalesByCategory());
    }
}
