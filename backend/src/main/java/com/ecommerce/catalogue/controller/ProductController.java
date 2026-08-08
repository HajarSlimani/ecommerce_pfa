package com.ecommerce.catalogue.controller;

import com.ecommerce.catalogue.dto.CreateProductRequest;
import com.ecommerce.catalogue.dto.ProductDTO;
import com.ecommerce.catalogue.dto.ProductDetailDTO;
import com.ecommerce.catalogue.service.ProductService;
import com.ecommerce.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<PageResponse<ProductDTO>> list(
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(productService.listProducts(category, pageable));
    }

    /**
     * Endpoint dédié à la Boutique : filtre catégorie + grade + texte libre,
     * tri, et prix minimum par produit — contrairement à {@link #list}, qui
     * reste un simple listing sans jointure vers les unités/prix.
     *
     * @param grade code exact de l'enum Grade ("NEUF", "A", "B", "C")
     * @param q     texte libre, recherché dans le nom et la marque
     * @param sort  "price_asc" | "price_desc" | "newest" | (vide = ordre par défaut)
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<ProductDTO>> search(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.searchProducts(category, grade, q, sort, page, size));
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

    /**
     * Associe une photo à une couleur donnée pour ce produit (voir la note
     * sur Product.colorImages) — utilisé par la fiche produit pour changer
     * de photo quand on change de couleur, au lieu d'afficher toujours la
     * même image quelle que soit la couleur choisie.
     */
    @PutMapping("/{id}/color-images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setColorImage(
            @PathVariable Long id,
            @Valid @RequestBody com.ecommerce.catalogue.dto.SetColorImageRequest request) {
        productService.setColorImage(id, request.getColor(), request.getImageUrl());
        return ResponseEntity.noContent().build();
    }
}
