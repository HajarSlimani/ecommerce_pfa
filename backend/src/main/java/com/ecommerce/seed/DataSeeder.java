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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
                                List<GradeDef> grades) {}

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
                        .emailVerified(true)
                        .build()));

        userRepository.findByEmail("client@test.com").orElseGet(() ->
               userRepository.save(User.builder()
                        .email("client@test.com")
                        .password(passwordEncoder.encode("client123"))
                        .fullName("Client Démo")
                        .role(Role.CLIENT)
                        .emailVerified(true)
                        .build()));

        log.info("Utilisateurs créés : admin@test.com / admin123, client@test.com / client123");
        return admin;
    }

    private List<Product> seedProductsAndUnits() {
        List<SeedProduct> defs = List.of(
                new SeedProduct("iPhone 13 128GB", "Apple", "smartphones",
                        "Smartphone reconditionné, écran OLED 6.1 pouces.",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("620.00"), 3),
                                new GradeDef(Grade.A, new BigDecimal("480.00"), 6),
                                new GradeDef(Grade.B, new BigDecimal("400.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("330.00"), 4)
                        )),
                new SeedProduct("Samsung Galaxy S21", "Samsung", "smartphones",
                        "Smartphone Android reconditionné, 128GB.",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("380.00"), 5),
                                new GradeDef(Grade.B, new BigDecimal("310.00"), 6),
                                new GradeDef(Grade.C, new BigDecimal("250.00"), 3)
                        )),
                new SeedProduct("MacBook Air M1", "Apple", "laptops",
                        "Ordinateur portable reconditionné, 256GB SSD, 8GB RAM.",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("950.00"), 2),
                                new GradeDef(Grade.A, new BigDecimal("780.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("650.00"), 3)
                        )),
                new SeedProduct("Dell XPS 13", "Dell", "laptops",
                        "Ultrabook reconditionné, i5, 16GB RAM, 512GB SSD.",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("690.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("560.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("450.00"), 2)
                        )),
                new SeedProduct("AirPods Pro", "Apple", "audio",
                        "Écouteurs sans fil reconditionnés avec réduction de bruit.",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("180.00"), 4),
                                new GradeDef(Grade.A, new BigDecimal("140.00"), 6),
                                new GradeDef(Grade.B, new BigDecimal("110.00"), 4)
                        )),
                new SeedProduct("Sony WH-1000XM4", "Sony", "audio",
                        "Casque sans fil à réduction de bruit active, reconditionné.",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("210.00"), 3),
                                new GradeDef(Grade.B, new BigDecimal("170.00"), 4)
                        )),
                new SeedProduct("iPad 9th Gen 64GB", "Apple", "electronics",
                        "Tablette reconditionnée, écran Retina 10.2 pouces.",
                        List.of(
                                new GradeDef(Grade.NEUF, new BigDecimal("320.00"), 3),
                                new GradeDef(Grade.A, new BigDecimal("260.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("190.00"), 3)
                        )),
                new SeedProduct("Google Pixel 10", "Google", "smartphones",
                        "Smartphone Android reconditionné, 128GB.",
                        List.of(
                                new GradeDef(Grade.A, new BigDecimal("340.00"), 4),
                                new GradeDef(Grade.B, new BigDecimal("280.00"), 5),
                                new GradeDef(Grade.C, new BigDecimal("220.00"), 3)
                        ))
        );

        List<Product> savedProducts = new ArrayList<>();
        String[] colors = {"Noir", "Blanc", "Bleu", "Gris sidéral"};

        for (SeedProduct def : defs) {
            RealImages real = REAL_PRODUCT_IMAGES.get(def.name());
            String imageUrl = (real != null)
                    ? real.defaultImageUrl()
                    : placeholderImage(def.name(), "F0EFEA", "111111");
            Map<String, String> colorImages = (real != null)
                    ? mergeWithPlaceholderFallback(def.name(), real.colorImages())
                    : buildColorImages(def.name());

            Product product = productRepository.save(Product.builder()
                    .name(def.name())
                    .brand(def.brand())
                    .category(def.category())
                    .description(def.description())
                    .imageUrl(imageUrl)
                    .colorImages(colorImages)
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

    /**
     * Vraies photos produit (Unsplash, licence libre — voir
     * https://unsplash.com/license, réutilisation commerciale autorisée,
     * hotlink via images.unsplash.com officiellement supporté par leur CDN).
     * Volontairement PAS de vraies photos de presse Apple/Samsung/etc. : ce
     * sont des images protégées (droit d'auteur + marque), risquées à
     * héberger/hotlinker même en lien externe dans un repo public.
     *
     * EXEMPLE REMPLI : "iPhone 13 128GB" (Noir + Blanc). Pour compléter les
     * autres produits, même pattern :
     *
     *   REAL_PRODUCT_IMAGES.put("Samsung Galaxy S21", new RealImages(
     *           "<url photo par défaut>",
     *           Map.of(
     *                   "Noir", "<url>",
     *                   "Blanc", "<url>",
     *                   "Bleu", "<url>",
     *                   "Gris sidéral", "<url>"
     *           )));
     *
     * Pas besoin de fournir les 4 couleurs d'un coup : toute couleur absente
     * de la map retombe automatiquement sur un placeholder généré (voir
     * mergeWithPlaceholderFallback) — tu peux compléter produit par produit,
     * couleur par couleur, sans jamais rien casser.
     */
    private record RealImages(String defaultImageUrl, Map<String, String> colorImages) {}

    private static final Map<String, RealImages> REAL_PRODUCT_IMAGES = new LinkedHashMap<>();
    static {
        Map<String, String> iphone13Colors = new LinkedHashMap<>();
        iphone13Colors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL4fVVVM8KlkWe5Qyn-sg_mEWYhJdp7dJ7dPOWMa0g6h4aCb6TeJzXvTWF&s=10");
        iphone13Colors.put("Blanc", "https://uno.ma/pub/media/catalog/product/cache/af8d7fd2c4634f9c922fba76a4a30c04/l/d/ld0006166728.jpg");
        iphone13Colors.put("Bleu", "https://imagedelivery.net/AZ5kNEcp8roCR6XQJU10qQ/aa54b976-3f1d-4fa3-45ae-53753d1a3f00/w=800,h=800,fit=crop");
        iphone13Colors.put("Gris sidéral", "https://http2.mlstatic.com/D_Q_NP_655013-MLA99442466886_112025-O.webp");
       

        REAL_PRODUCT_IMAGES.put("iPhone 13 128GB", new RealImages(
                "https://uno.ma/pub/media/catalog/product/cache/af8d7fd2c4634f9c922fba76a4a30c04/l/d/ld0006166728.jpg",
                iphone13Colors
        ));

        Map<String, String> samsungGalaxyS21Colors = new LinkedHashMap<>();
        samsungGalaxyS21Colors.put("Noir", "https://media.falabella.com/falabellaCL/114048724_01/w=1500,h=1500,fit=cover");
        samsungGalaxyS21Colors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCC7keCtthx82OcdEVmseZXZBanlu0WMGiRUJCso9EdOGPEAsBSmYRbVIB&s=10");
        samsungGalaxyS21Colors.put("Bleu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWhPWUY-GtCOYtN8xVI3gy-EXP6vAse-KdQDQu3Y9_bg&s=10");
        samsungGalaxyS21Colors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAcUt05MzZD2nAGOQd-nuqRPJ9SX0mw-qIJWkURJ4D5o8HNKFaX3Zd-EU&s=10");

        REAL_PRODUCT_IMAGES.put("Samsung Galaxy S21", new RealImages(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCC7keCtthx82OcdEVmseZXZBanlu0WMGiRUJCso9EdOGPEAsBSmYRbVIB&s=10",
                samsungGalaxyS21Colors
        ));


        Map<String, String> macBookAirM1Colors = new LinkedHashMap<>();
        macBookAirM1Colors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4ZIT_taNCa4iMFxC_mKyVzLQTT35sps_6Pg0M6xeoFS2-PyICvyn1iXg&s=10");
        macBookAirM1Colors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBf5SCQzy0eCL-kJhHQJgpeQXJa-Dq2GzIJr-G7_WIEQ&s=10");
        macBookAirM1Colors.put("Bleu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjK0B1ZDfpPX5xAvqpaYqMVd0IiQ82nwqtHVbd3R3ZjQ&s=10");
        macBookAirM1Colors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdYw7Iqkua_O6s58Z8SVGYjICwy87Utl25DjqgoHiZuxPeccSlHOW7cYZ2&s=10");

        REAL_PRODUCT_IMAGES.put("MacBook Air M1", new RealImages(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4ZIT_taNCa4iMFxC_mKyVzLQTT35sps_6Pg0M6xeoFS2-PyICvyn1iXg&s=10",
                macBookAirM1Colors
        ));

        Map<String, String> dellXPS13Colors = new LinkedHashMap<>();
        dellXPS13Colors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAhZILELvU-z6Lnx0LYWxbXOEezxG-jFGCM5Ry7S2kxA&s=10");
        dellXPS13Colors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5yyp_xweESUpYXecwl7ERg2R4-tOOLRq99u6wwM6rcsGEUPewNtCIE9Y&s=10");
        dellXPS13Colors.put("Bleu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl5CEKN8FX_OIx40PIKRO8dF8O6TMWZjlN0qrpgZXMOw&s=10");
        dellXPS13Colors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThq5Dd1uuVpjvx3IlhwVH4M_vbvRDzBlVKu76vg3mIHg&s=10");

        REAL_PRODUCT_IMAGES.put("Dell XPS 13", new RealImages(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5yyp_xweESUpYXecwl7ERg2R4-tOOLRq99u6wwM6rcsGEUPewNtCIE9Y&s=10",
                dellXPS13Colors
        ));

        Map<String, String> airPodsProColors = new LinkedHashMap<>();
        airPodsProColors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwVkJXBuRUseyow6VIWhYDAi_Uv61N2n3c5HXBU23ccg&s=10");
        airPodsProColors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJhARjmKObVuJlE1dU2W7x64BSxcTIfKgXq5dvfrBvsg&s=10");
        airPodsProColors.put("Bleu", "https://i-vse.ru/wa-data/public/shop/products/60/04/460/images/3946/3946.970.JPG");
        airPodsProColors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRXL95s6wqtbGliWJTD7RYSjZZzteIxrX2GTQwrapBA&s=10");

        REAL_PRODUCT_IMAGES.put("AirPods Pro", new RealImages(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzRXL95s6wqtbGliWJTD7RYSjZZzteIxrX2GTQwrapBA&s=10",
                airPodsProColors
        ));

        Map<String, String> sonyWH1000XM4Colors = new LinkedHashMap<>();
        sonyWH1000XM4Colors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE1kRrpRbUsVdrMsEMcMYkRxUE_m9V3ufEuI2TA5J6qK9scQMNrVXWQnE&s=10");
        sonyWH1000XM4Colors.put("Blanc", "https://techbuzzireland.com/wp-content/uploads/2021/04/wh-1000xm4_white_with_case2-large.jpg");
        sonyWH1000XM4Colors.put("Bleu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlZcDNGdZ7vCkKYR-wqsjDBnZet9bbqbXZBeC6_c-8iV1s2Wsy3F6RmL4&s=10");
        sonyWH1000XM4Colors.put("Gris sidéral", "https://www.adorama.com/images/Large/SOWH1000XM4S_2.JPG");

        REAL_PRODUCT_IMAGES.put("Sony WH-1000XM4", new RealImages(
                "https://techbuzzireland.com/wp-content/uploads/2021/04/wh-1000xm4_white_with_case2-large.jpg",
                sonyWH1000XM4Colors
        ));

        Map<String, String> iPad9thGen64GBColors = new LinkedHashMap<>();
        iPad9thGen64GBColors.put("Noir", "https://www.att.com/scmsassets/global/devices/tablets/apple/apple-ipad-9th-generation-2021/defaultimage/space-gray-hero-zoom.png");
        iPad9thGen64GBColors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR4LNibURuqHHT_BWZWAyaLMdzLWM6sgBeXZ9TY1G8yg&s=10");
        iPad9thGen64GBColors.put("Bleu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq02f2zk2C8AaQfp-OEBWpOB_2h3T892bJA56orh7W3Q&s");
        iPad9thGen64GBColors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1cy88UDu72fKCYZGVsf-R_Ubjym3lx2hQZ_GE7aGwhtTiScssNXDDWvM7&s=10");

        REAL_PRODUCT_IMAGES.put("iPad 9th Gen 64GB", new RealImages(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq02f2zk2C8AaQfp-OEBWpOB_2h3T892bJA56orh7W3Q&s",
                iPad9thGen64GBColors
        ));

        Map<String, String> googlePixel6Colors = new LinkedHashMap<>();
        googlePixel6Colors.put("Noir", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrgcvhv5PpisYlHZOdpK2IcTQGmucz9RFmsFOLENUcqw&s=10");
        googlePixel6Colors.put("Blanc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKf2NFXTR-2BdVSuQSXYtkdWsrlmFUVtKox0-pM0iZDg&s=10");
        googlePixel6Colors.put("Bleu", "https://i0.wp.com/telefonat.ma/wp-content/uploads/2025/08/Google-Pixel-10.jpg");
        googlePixel6Colors.put("Gris sidéral", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiv_f4ulc_DTJFicpZ3j5TStuA5LYhWzQHZqH2XWUcVV593VA5g0CGwGi2&s=10");

        REAL_PRODUCT_IMAGES.put("Google Pixel 10", new RealImages(
                "https://i0.wp.com/telefonat.ma/wp-content/uploads/2025/08/Google-Pixel-10.jpg",
                googlePixel6Colors
        ));


    }

    private Map<String, String> mergeWithPlaceholderFallback(String productName, Map<String, String> realColorImages) {
        Map<String, String> merged = new LinkedHashMap<>();
        COLOR_PALETTE.forEach((color, hexes) -> {
            String real = realColorImages.get(color);
            merged.put(color, real != null ? real : placeholderImage(productName + " — " + color, hexes[0], hexes[1]));
        });
        return merged;
    }

    /**
     * Couleurs de démo (bg/texte) pour générer des visuels distincts par
     * couleur via placehold.co — pas de vraies photos produit ici pour
     * éviter tout souci de droits sur des images de marques (Apple,
     * Samsung...) dans des données de seed ; en prod/démo réelle, on
     * remplace ça par de vraies photos via PUT /products/{id}/color-images.
     */
    private static final Map<String, String[]> COLOR_PALETTE = new LinkedHashMap<>();
    static {
        COLOR_PALETTE.put("Noir", new String[]{"1A1A1A", "FFFFFF"});
        COLOR_PALETTE.put("Blanc", new String[]{"F5F4F0", "111111"});
        COLOR_PALETTE.put("Bleu", new String[]{"1D4ED8", "FFFFFF"});
        COLOR_PALETTE.put("Gris sidéral", new String[]{"71717A", "FFFFFF"});
    }

    private String placeholderImage(String label, String bgHex, String fgHex) {
        String encodedLabel = URLEncoder.encode(label, StandardCharsets.UTF_8);
        return "https://placehold.co/800x800/" + bgHex + "/" + fgHex + "?text=" + encodedLabel;
    }

    /**
     * Une image par couleur pour un produit donné, afin que la fiche produit
     * affiche bien une photo différente selon la couleur choisie (voir
     * Product.colorImages) — chaque couleur a son propre fond, ce qui rend
     * le changement de photo visible et démontrable.
     */
    private Map<String, String> buildColorImages(String productName) {
        Map<String, String> images = new LinkedHashMap<>();
        COLOR_PALETTE.forEach((color, hexes) ->
                images.put(color, placeholderImage(productName + " — " + color, hexes[0], hexes[1])));
        return images;
    }

    private BigDecimal applyRandomVariation(BigDecimal base, double minPct, double maxPct) {
        double pct = minPct + (maxPct - minPct) * random.nextDouble();
        BigDecimal factor = BigDecimal.valueOf(1 + pct);
        BigDecimal result = base.multiply(factor).setScale(2, RoundingMode.HALF_UP);
        // jamais de prix négatif ou dérisoire
        return result.compareTo(BigDecimal.TEN) < 0 ? BigDecimal.TEN : result;
    }
}