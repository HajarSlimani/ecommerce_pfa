package com.ecommerce.seed;
import com.ecommerce.auth.User;
import com.ecommerce.auth.UserRepository;
import com.ecommerce.catalogue.entity.Product;
import com.ecommerce.catalogue.entity.ProductUnit;
import com.ecommerce.catalogue.repository.ProductRepository;
import com.ecommerce.catalogue.repository.ProductUnitRepository;
import com.ecommerce.commande.entity.Order;
import com.ecommerce.commande.entity.OrderItem;
import com.ecommerce.commande.repository.OrderRepository;
import com.ecommerce.common.enums.Grade;
import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.enums.Role;
import com.ecommerce.common.enums.UnitStatus;
import com.ecommerce.pricing.entity.CompetitorPrice;
import com.ecommerce.pricing.entity.PriceHistory;
import com.ecommerce.pricing.entity.SalesVelocitySnapshot;
import com.ecommerce.pricing.repository.CompetitorPriceRepository;
import com.ecommerce.pricing.repository.PriceHistoryRepository;
import com.ecommerce.pricing.repository.SalesVelocitySnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Peuple la base avec des données de démo réalistes : utilisateurs, produits,
 * unités par grade, historique de pricing (étalé sur 30 jours pour que le
 * graphique du dashboard admin ait de quoi s'afficher), prix concurrents,
 * vélocité des ventes, et une commande d'exemple.
 *
 * Activation : app.seed.enabled=true (désactivé par défaut). Idempotent :
 * ne fait rien si des produits existent déjà, donc sans danger de le laisser
 * activé en dev.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductUnitRepository productUnitRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final CompetitorPriceRepository competitorPriceRepository;
    private final SalesVelocitySnapshotRepository velocityRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    private final Random random = new Random(42); // seed fixe = données reproductibles

    private record SeedProduct(String name, String brand, String category, String description,
                                String imageUrl, List<GradeDef> grades) {}

    private record GradeDef(Grade grade, BigDecimal basePrice, int unitCount) {}

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        if (productRepository.count() > 0) {
            log.info("Seed ignoré : des produits existent déjà en base.");
            return;
        }

        log.info("=== Démarrage du seed de données de démo ===");

        User admin = seedUsers();
        List<Product> products = seedProductsAndUnits();
        seedPriceHistoryAndSignals(products);
        seedSampleOrder(products, admin);

        log.info("=== Seed terminé : {} produits créés ===", products.size());
    }

    private User seedUsers() {
        User admin = userRepository.findByEmail("admin@test.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .email("admin@test.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Admin Démo")
                        .role(Role.ADMIN)
                        .build()));

        userRepository.findByEmail("client@test.com").orElseGet(() ->
               userRepository.save(User.builder()
                        .email("client@test.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Client Démo")
                        .role(Role.CLIENT)
                        .build()));

        log.info("Utilisateurs créés : admin@test.com / admin123, client@test.com / client123");
        return admin;
    }

    private List<Product> seedProductsAndUnits() {
        List<SeedProduct> defs = List.of(
                new SeedProduct("iPhone 13 128GB", "Apple", "smartphones",
                        "Smartphone reconditionné, écran OLED 6.1 pouces.",
                        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("620.00"), 3),
                                new GradeDef(Grade.A, new BigDecimal("480.00"), 6),
                                new GradeDef(Grade.B, new BigDecimal("400.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("330.00"), 4)
                        )),
                new SeedProduct("Samsung Galaxy S21", "Samsung", "smartphones",
                        "Smartphone Android reconditionné, 128GB.",
                        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("380.00"), 5),
                                new GradeDef(Grade.B, new BigDecimal("310.00"), 6),
                                new GradeDef(Grade.C, new BigDecimal("250.00"), 3)
                        )),
                new SeedProduct("MacBook Air M1", "Apple", "laptops",
                        "Ordinateur portable reconditionné, 256GB SSD, 8GB RAM.",
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("950.00"), 2),
                                new GradeDef(Grade.A, new BigDecimal("780.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("650.00"), 3)
                        )),
                new SeedProduct("Dell XPS 13", "Dell", "laptops",
                        "Ultrabook reconditionné, i5, 16GB RAM, 512GB SSD.",
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("690.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("560.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("450.00"), 2)
                        )),
                new SeedProduct("AirPods Pro", "Apple", "audio",
                        "Écouteurs sans fil reconditionnés avec réduction de bruit.",
                        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("180.00"), 4),
                                new GradeDef(Grade.A, new BigDecimal("140.00"), 6),
                                new GradeDef(Grade.B, new BigDecimal("110.00"), 4)
                        )),
                new SeedProduct("Sony WH-1000XM4", "Sony", "audio",
                        "Casque sans fil à réduction de bruit active, reconditionné.",
                        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("210.00"), 3),
                                new GradeDef(Grade.B, new BigDecimal("170.00"), 4)
                        )),
                new SeedProduct("iPad 9th Gen 64GB", "Apple", "electronics",
                        "Tablette reconditionnée, écran Retina 10.2 pouces.",
                        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("320.00"), 3),
                                new GradeDef(Grade.A, new BigDecimal("260.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("190.00"), 3)
                        )),
                new SeedProduct("Google Pixel 6", "Google", "smartphones",
                        "Smartphone Android reconditionné, 128GB.",
                        "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("340.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("280.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("220.00"), 3)
                        ))
        );

        List<Product> savedProducts = new ArrayList<>();
        String[] colors = {"Noir", "Blanc", "Bleu", "Gris sidéral"};

        for (SeedProduct def : defs) {
            Product product = productRepository.save(Product.builder()
                    .name(def.name())
                    .brand(def.brand())
                    .category(def.category())
                    .description(def.description())
                    .imageUrl(def.imageUrl())
                    .build());

            int serialCounter = 1;
            for (GradeDef gradeDef : def.grades()) {
                for (int i = 0; i < gradeDef.unitCount(); i++) {
                    String serial = "SN-" + product.getId() + "-" + gradeDef.grade() + "-" + serialCounter++;
                    productUnitRepository.save(ProductUnit.builder()
                            .product(product)
                            .serialNumber(serial)
                            .grade(gradeDef.grade())
                            .color(colors[i % colors.length])
                            .status(UnitStatus.AVAILABLE)
                            .currentPrice(gradeDef.basePrice())
                            .enteredStockAt(Instant.now().minus(random.nextInt(20), ChronoUnit.DAYS))
                            .build());
                }
            }
            savedProducts.add(product);
        }

        log.info("{} produits créés avec leurs unités par grade", savedProducts.size());
        return savedProducts;
    }

   /**
     * Génère un historique de pricing étalé sur les 30 derniers jours pour
     * chaque (produit, grade), avec des prix concurrents et un snapshot de
     * vélocité — assez de données pour que le dashboard admin (table +
     * graphique cumulé) ait un rendu parlant dès le premier lancement.
     */
    private void seedPriceHistoryAndSignals(List<Product> products) {
        String[] reasons = {
                "Stock faible et forte demande récente → hausse de prix",
                "Concurrence plus agressive détectée → baisse de prix",
                "Vélocité des ventes en baisse → ajustement à la baisse pour stimuler la demande",
                "Stock abondant, écoulement à accélérer → baisse de prix",
                "Demande soutenue, stock limité → légère hausse",
        };

        int historyCount = 0;

        for (Product product : products) {
            List<Grade> grades = productUnitRepository.findAvailableGrades(product.getId());

            for (Grade grade : grades) {
                BigDecimal basePrice = productUnitRepository
                        .findByProductIdAndStatus(product.getId(), UnitStatus.AVAILABLE)
                        .stream()
                        .filter(u -> u.getGrade() == grade)
                        .findFirst()
                        .map(ProductUnit::getCurrentPrice)
                        .orElse(new BigDecimal("300.00"));

                // Prix concurrents (2 concurrents fictifs, autour du prix de base)
                competitorPriceRepository.save(CompetitorPrice.builder()
                        .productId(product.getId())
                        .grade(grade)
                        .competitorName("TechTrade")
                        .price(applyRandomVariation(basePrice, -0.08, 0.05))
                        .collectedAt(Instant.now().minus(1, ChronoUnit.DAYS))
                        .build());

                competitorPriceRepository.save(CompetitorPrice.builder()
                        .productId(product.getId())
                        .grade(grade)
                        .competitorName("ReBuy")
                        .price(applyRandomVariation(basePrice, -0.05, 0.08))
                        .collectedAt(Instant.now().minus(1, ChronoUnit.DAYS))
                        .build());

                // Vélocité des ventes (snapshot sur les 7 derniers jours)
                velocityRepository.save(SalesVelocitySnapshot.builder()
                        .productId(product.getId())
                        .grade(grade)
                        .windowStart(Instant.now().minus(7, ChronoUnit.DAYS))
                        .windowEnd(Instant.now())
                        .unitsSold(1 + random.nextInt(10))
                        .build());

                // Historique de prix : 3 à 6 ajustements étalés sur 30 jours
                BigDecimal runningPrice = basePrice;
                int adjustments = 3 + random.nextInt(4);

                for (int i = adjustments; i >= 1; i--) {
                    Instant createdAt = Instant.now().minus(i * (30 / adjustments), ChronoUnit.DAYS);

                    BigDecimal oldPrice = runningPrice;
                    BigDecimal newPrice = applyRandomVariation(oldPrice, -0.07, 0.06);
                    runningPrice = newPrice;

                    BigDecimal estimatedImpact = newPrice.subtract(oldPrice)
                            .multiply(BigDecimal.valueOf(1 + random.nextInt(5)))
                            .setScale(2, RoundingMode.HALF_UP);

                    String reasoning = reasons[random.nextInt(reasons.length)];

                    priceHistoryRepository.save(PriceHistory.builder()
                            .productId(product.getId())
                            .grade(grade)
                            .oldPrice(oldPrice)
                            .newPrice(newPrice)
                            .estimatedRevenueImpact(estimatedImpact)
                            .signalsJson("{\"reasoning\":\"" + reasoning + "\",\"confidenceScore\":0."
                                    + (60 + random.nextInt(35)) + "}")
                            .createdAt(createdAt)
                            .build());

                    historyCount++;
                }
            }
        }

        log.info("{} entrées d'historique de pricing créées (30 derniers jours)", historyCount);
    }

    /**
     * Crée une commande de démonstration pour le compte client, en vendant
     * réellement 2 unités (elles passent donc à SOLD) — utile pour voir
     * OrderHistoryPage non-vide côté front sans avoir à checkout manuellement.
     */
    private void seedSampleOrder(List<Product> products, User admin) {
        User client = userRepository.findByEmail("client@test.com").orElse(null);
        if (client == null || products.isEmpty()) {
            return;
        }

        Product firstProduct = products.get(0);
        List<ProductUnit> availableUnits = productUnitRepository
                .findByProductIdAndStatus(firstProduct.getId(), UnitStatus.AVAILABLE);

        if (availableUnits.isEmpty()) {
            return;
        }

        ProductUnit unitToSell = availableUnits.get(0);
        unitToSell.setStatus(UnitStatus.SOLD);
        unitToSell.setSoldAt(Instant.now().minus(3, ChronoUnit.DAYS));
        productUnitRepository.save(unitToSell);
        
        Order order = Order.builder()
                .userId(client.getId())
                .status(OrderStatus.CONFIRMED)
                .total(unitToSell.getCurrentPrice())
                .createdAt(Instant.now().minus(3, ChronoUnit.DAYS))
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .productUnitId(unitToSell.getId())
                .productId(firstProduct.getId())
                .productName(firstProduct.getName())
                .priceAtPurchase(unitToSell.getCurrentPrice())
                .build();

        order.setItems(new ArrayList<>(List.of(item)));
        orderRepository.save(order);

        log.info("Commande de démo créée pour client@test.com (produit : {})", firstProduct.getName());
    }

    private BigDecimal applyRandomVariation(BigDecimal base, double minPct, double maxPct) {
        double pct = minPct + (maxPct - minPct) * random.nextDouble();
        BigDecimal factor = BigDecimal.valueOf(1 + pct);
        BigDecimal result = base.multiply(factor).setScale(2, RoundingMode.HALF_UP);
        // jamais de prix négatif ou dérisoire
        return result.compareTo(BigDecimal.TEN) < 0 ? BigDecimal.TEN : result;
    }
}