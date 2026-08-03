package com.ecommerce.catalogue.service;

import com.ecommerce.catalogue.dto.*;
import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.UnitStatus;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;

    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #category")
    public Page<ProductDTO> listProducts(String category, Pageable pageable) {
        Page<Product> page = (category == null || category.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findByCategory(category, pageable);
        return page.map(this::toDTO);
    }

    /**
     * Fiche produit détaillée + variantes disponibles (une par grade en stock).
     * Cache court (2 min) car le stock/prix change fréquemment avec le pricing dynamique.
     */
    @Cacheable(value = "productVariants", key = "#productId")
    public ProductDetailDTO getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + productId));

        List<Grade> availableGrades = productUnitRepository.findAvailableGrades(productId);

        List<VariantDTO> variants = availableGrades.stream()
                .map(grade -> buildVariant(productId, grade))
                .toList();

        return ProductDetailDTO.builder()
                .product(toDTO(product))
                .variants(variants)
                .build();
    }

    private VariantDTO buildVariant(Long productId, Grade grade) {
        long stock = productUnitRepository.countByProductIdAndGradeAndStatus(productId, grade, UnitStatus.AVAILABLE);

        var units = productUnitRepository.findByProductIdAndStatus(productId, UnitStatus.AVAILABLE)
                .stream()
                .filter(u -> u.getGrade() == grade)
                .toList();

        var currentPrice = units.isEmpty() ? null : units.get(0).getCurrentPrice();

        return VariantDTO.builder()
                .grade(grade)
                .currentPrice(currentPrice)
                .availableStock(stock)
                .build();
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDTO createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .brand(request.getBrand())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();

        return toDTO(productRepository.save(product));
    }

    @org.springframework.cache.annotation.CacheEvict(value = "productVariants", key = "#productId")
    public void addUnit(Long productId, CreateProductUnitRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + productId));

        var unit = com.ecommerce.catalogue.entity.ProductUnit.builder()
                .product(product)
                .serialNumber(request.getSerialNumber())
                .grade(request.getGrade())
                .status(UnitStatus.AVAILABLE)
                .currentPrice(request.getCurrentPrice())
                .build();

        productUnitRepository.save(unit);
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .brand(product.getBrand())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
