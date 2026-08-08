package com.ecommerce.catalogue.service;

import com.ecommerce.catalogue.dto.*;
import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.common.dto.PageResponse;
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

    /**
     * Retourne PageResponse (DTO maison) plutôt que Page/PageImpl de Spring
     * Data : PageImpl n'a pas de constructeur par défaut et n'est pas
     * fiablement désérialisable par Jackson, ce qui casse la lecture du
     * cache Redis dès la 2e requête (la 1re, en cache MISS, fonctionne
     * puisqu'elle ne désérialise rien).
     */
    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #category")
    public PageResponse<ProductDTO> listProducts(String category, Pageable pageable) {
        Page<Product> page = (category == null || category.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findByCategory(category, pageable);
        return PageResponse.from(page, this::toDTO);
    }

    /**
     * Recherche filtrée pour la Boutique (catégorie, grade, texte libre, tri).
     * Volontairement NON mise en cache : contrairement à listProducts, le
     * résultat inclut un prix (minPrice) qui change en continu avec le
     * pricing dynamique — mettre ça en cache reviendrait à afficher des prix
     * potentiellement obsolètes, ce qui est particulièrement mauvais vu que
     * le pricing dynamique est l'argument central du projet.
     */
    public PageResponse<ProductDTO> searchProducts(String category, String grade, String search,
                                                     String sort, int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        Page<ProductRepository.ProductSearchProjection> results = productRepository.search(
                blankToNull(category), blankToNull(grade), blankToNull(search), blankToNull(sort), pageable);
        return PageResponse.from(results, this::fromProjection);
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    private ProductDTO fromProjection(ProductRepository.ProductSearchProjection p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .brand(p.getBrand())
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .minPrice(p.getMinPrice())
                .build();
    }

    /**
     * Fiche produit détaillée + variantes disponibles (une par combinaison
     * grade+couleur en stock).
     * Cache court (2 min) car le stock/prix change fréquemment avec le pricing dynamique.
     */
    @Cacheable(value = "productVariants", key = "#productId")
    public ProductDetailDTO getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + productId));

        List<VariantDTO> variants = productUnitRepository.findAvailableVariantCombos(productId).stream()
                .map(combo -> buildVariant(productId, combo.getGrade(), combo.getColor()))
                .toList();

        return ProductDetailDTO.builder()
                .product(toDTO(product))
                .variants(variants)
                .build();
    }

    private VariantDTO buildVariant(Long productId, Grade grade, String color) {
        long stock = productUnitRepository.countByProductIdAndGradeAndColorAndStatus(
                productId, grade, color, UnitStatus.AVAILABLE);

        var units = productUnitRepository.findByProductIdAndStatus(productId, UnitStatus.AVAILABLE)
                .stream()
                .filter(u -> u.getGrade() == grade && u.getColor().equals(color))
                .toList();

        var currentPrice = units.isEmpty() ? null : units.get(0).getCurrentPrice();

        return VariantDTO.builder()
                .grade(grade)
                .color(color)
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
                .color(request.getColor())
                .status(UnitStatus.AVAILABLE)
                .currentPrice(request.getCurrentPrice())
                .build();

        productUnitRepository.save(unit);
    }

    /**
     * Définit/écrase la photo associée à une couleur pour ce produit.
     * Évince le cache productVariants (la fiche détail sert ces images) —
     * pas besoin de toucher au cache "products" (listing), qui ne renvoie
     * pas colorImages.
     */
    @CacheEvict(value = "productVariants", key = "#productId")
    public void setColorImage(Long productId, String color, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + productId));
        product.getColorImages().put(color, imageUrl);
        productRepository.save(product);
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .brand(product.getBrand())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .colorImages(product.getColorImages())
                .build();
    }
}
