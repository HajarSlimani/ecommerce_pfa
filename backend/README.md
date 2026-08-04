# ecommerce-backend (Spring Boot)

Backend principal du projet : catalogue, panier, commandes, authentification,
et orchestration du moteur de pricing dynamique (appel au microservice FastAPI).

## Prérequis
- Java 17+
- Maven 3.9+
- Docker (pour PostgreSQL + Redis en local)

## Démarrage rapide

```bash
# 1. Lancer PostgreSQL et Redis
docker compose up -d

# 2. Lancer l'application (les tables sont créées automatiquement via ddl-auto=update)
./mvnw spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

## Tester avec Swagger

Une fois l'application lancée, ouvre :

```
http://localhost:8080/swagger-ui.html
```

Tous les endpoints sont listés et testables directement depuis l'interface.

**Pour tester les endpoints protégés (panier, commandes, admin) :**
1. Déplie `POST /api/auth/register` (ou `/login` si tu as déjà un compte), clique "Try it out", envoie une requête
2. Copie la valeur du champ `token` dans la réponse
3. Clique sur le bouton **Authorize** en haut à droite de la page
4. Colle uniquement le token (sans le préfixe `Bearer `), valide
5. Tous tes appels suivants depuis Swagger UI incluront automatiquement le header `Authorization`

**Pour tester les endpoints ADMIN** (créer un produit, ajouter des unités, voir l'historique de pricing) : après avoir créé ton compte, passe-le en ADMIN via `scripts/seed_promote_admin.sql`, puis refais un login pour obtenir un nouveau token avec le rôle à jour.

## Variables d'environnement principales

| Variable | Défaut | Description |
|---|---|---|
| `DB_USERNAME` / `DB_PASSWORD` | postgres / postgres | Connexion PostgreSQL |
| `REDIS_HOST` / `REDIS_PORT` | localhost / 6379 | Connexion Redis |
| `JWT_SECRET` | (valeur par défaut, à changer en prod) | Clé de signature JWT |
| `PRICING_SERVICE_URL` | http://localhost:8000 | URL du microservice FastAPI de pricing |

## Contrat attendu côté microservice FastAPI

Le backend appelle `POST {PRICING_SERVICE_URL}/pricing/compute` avec ce payload :

```json
{
  "productId": 1,
  "grade": "A",
  "currentPrice": 380.00,
  "unitsSoldLast7Days": 12,
  "availableStock": 8,
  "competitorPrices": [370.00, 395.00]
}
```

Et attend cette réponse :

```json
{
  "newPrice": 365.00,
  "estimatedRevenueImpact": 120.50,
  "reasoning": "Stock faible + concurrence légèrement inférieure",
  "confidenceScore": 0.82
}
```

## Structure des modules

- `auth/` — inscription, connexion, JWT, sécurité
- `catalogue/` — Product (modèle) + ProductUnit (unité sérialisée par grade)
- `panier/` — Cart / CartItem (vérification de stock souple, pas de réservation)
- `commande/` — Order / OrderItem, assignation FIFO verrouillée à la validation
- `pricing/` — PriceHistory, appel au microservice ML, scheduler de recalcul périodique
- `config/` — Sécurité, Redis, WebClient

## Endpoints principaux

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
GET    /api/products/{id}
GET    /api/products/{id}/variants
POST   /api/products                         (ADMIN)

GET    /api/cart
POST   /api/cart/items
DELETE /api/cart/items/{itemId}

POST   /api/orders                            (checkout du panier courant)
GET    /api/orders/{id}
GET    /api/orders/user/{userId}

GET    /api/admin/pricing/history             (ADMIN)
GET    /api/admin/pricing/impact              (ADMIN)
POST   /api/admin/pricing/recalculate/{id}    (ADMIN)
```

## Points à faire évoluer ensuite
- Réservation de stock avec expiration (TTL) au niveau du panier
- Calcul d'impact revenu a posteriori (croisement avec OrderItem plutôt que
  seulement l'estimation ML au moment de la décision)
- Tests d'intégration (Testcontainers pour Postgres/Redis)
- Pagination/filtrage plus riche sur le catalogue (recherche, tri par prix)
