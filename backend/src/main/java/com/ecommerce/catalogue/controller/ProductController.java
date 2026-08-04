package com.ecommerce.catalogue.controller;

import com.ecommerce.catalogue.dto.CreateProductRequest;
import com.ecommerce.catalogue.dto.ProductDTO;
import com.ecommerce.catalogue.dto.ProductDetailDTO;
import com.ecommerce.catalogue.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> list(
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(productService.listProducts(category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    @GetMapping("/{id}/variants")
    public ResponseEntity<ProductDetailDTO> getVariants(@PathVariable Long id) {
        // même payload que getDetail, endpoint dédié pour le front (sélecteur de grade)
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PostMapping("/{id}/units")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> addUnit(@PathVariable Long id,
                                         @Valid @RequestBody com.ecommerce.catalogue.dto.CreateProductUnitRequest request) {
        productService.addUnit(id, request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).build();
    }
}
