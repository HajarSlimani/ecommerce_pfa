# ecommerce-frontend (React + Vite)

Frontend du projet : catalogue avec sélecteur de grade, panier, commandes,
authentification, et dashboard admin pour le pricing dynamique.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- TanStack React Query (cache, invalidation automatique)
- Axios
- Recharts (graphique impact revenu)
- react-hot-toast (notifications)

## Démarrage

```bash
npm install
cp .env.example .env    # ajuster VITE_API_BASE_URL si besoin
npm run dev
```

L'app démarre sur `http://localhost:5173`. Le backend Spring Boot doit tourner
sur `http://localhost:8080` (CORS déjà configuré côté backend pour accepter
n'importe quel port localhost).

## Structure

```
src/
├── api/          → clients Axios par domaine (auth, product, cart, order, pricing)
├── context/      → AuthContext
├── hooks/        → wrappers React Query (useProducts, useCart, useOrders, usePricing)
├── components/
│   ├── common/   → Navbar, PriceTag (composant signature), ProtectedRoute, AdminRoute...
│   ├── catalogue/→ ProductCard, ProductGrid, GradeSelector
│   ├── cart/     → CartItemRow, CartSummary
│   └── admin/    → ProductForm, PriceHistoryTable, RevenueImpactChart...
├── pages/        → une page par route, + pages/admin pour le dashboard
├── routes/       → AppRouter.jsx (toutes les routes)
└── utils/        → formatCurrency, formatDate, jwt (décodage local)
```

## Design

- Typo : **Space Grotesk** (titres) + **Inter** (corps) + **JetBrains Mono** (prix, données)
- Palette : slate/ink neutre + accent teal (`brand`), rouge/vert pour les variations de prix (`deal.up`/`deal.down`)
- Élément signature : `PriceTag` — affichage "ticker" des prix avec indicateur de variation (▲/▼ + %), cohérent avec le thème du pricing piloté par IA

## Notes importantes

- **userId** n'est pas renvoyé explicitement par `/api/auth/login` : il est extrait du JWT côté client (`utils/jwt.js`) car le claim `userId` y est déjà inclus par le backend.
- **Panier "simple"** (pas de réservation TTL) : le stock affiché peut légèrement décaler entre deux clients concurrents jusqu'au checkout (verrou pessimiste géré côté backend à ce moment-là).
- **Graphique dashboard** : le scénario "statique" est une ligne de référence à 0 (absence d'ajustement), le "dynamique" cumule les `estimatedRevenueImpact` retournés par le moteur ML à chaque décision — c'est une projection, pas un calcul a posteriori sur les ventes réelles (voir la note équivalente côté backend).

## Prochaines étapes possibles

- Rôle CLIENT : page profil, édition adresse
- Recherche texte dans le catalogue
- Pagination/tri par prix
- Vrai calcul a posteriori de l'impact revenu (croisement avec les commandes réelles)
- Tests (Vitest + React Testing Library)
