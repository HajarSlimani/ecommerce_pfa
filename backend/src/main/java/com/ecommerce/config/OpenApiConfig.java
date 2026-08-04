package com.ecommerce.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

/**
 * Configuration Swagger UI, accessible sur /swagger-ui.html une fois l'app lancée.
 * Utilise le bouton "Authorize" en haut à droite pour coller un token JWT
 * (juste le token, sans le préfixe "Bearer ", springdoc l'ajoute automatiquement)
 * obtenu via POST /api/auth/login ou /api/auth/register.
 */
@OpenAPIDefinition(
        info = @Info(
                title = "Ecommerce PFA — API Backend",
                version = "0.1.0",
                description = "Catalogue, panier, commandes, auth, et orchestration du pricing dynamique"
        ),
        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
