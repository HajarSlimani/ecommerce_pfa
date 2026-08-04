#!/usr/bin/env bash
# Script de vérification end-to-end du backend.
# Prérequis : docker compose up -d, puis ./mvnw spring-boot:run
set -e

BASE_URL="http://localhost:8080"

echo "== 1. Register client =="
CLIENT_RESP=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"password123","fullName":"Client Test"}')
echo "$CLIENT_RESP"
CLIENT_TOKEN=$(echo "$CLIENT_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo ""
echo "== 2. Register admin (sera promu ADMIN manuellement en base, voir seed.sql) =="
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","fullName":"Admin Test"}'
echo ""
echo ">>> Exécute maintenant seed_promote_admin.sql avant de continuer, puis relance ce script à partir d'ici (commente les 2 blocs register ci-dessus)."
echo ""

echo "== 3. Login admin =="
ADMIN_RESP=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}')
echo "$ADMIN_RESP"
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo ""
echo "== 4. Créer un produit (ADMIN) =="
PRODUCT_RESP=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"iPhone 13 128GB","description":"Reconditionné","brand":"Apple","category":"electronics"}')
echo "$PRODUCT_RESP"
PRODUCT_ID=$(echo "$PRODUCT_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo ""
echo "== 5. Ajouter des unités (grades A et B) =="
curl -s -X POST "$BASE_URL/api/products/$PRODUCT_ID/units" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"serialNumber":"SN-A-001","grade":"A","currentPrice":380.00}'
echo ""
curl -s -X POST "$BASE_URL/api/products/$PRODUCT_ID/units" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"serialNumber":"SN-B-001","grade":"B","currentPrice":320.00}'
echo ""

echo ""
echo "== 6. Voir la fiche produit + variantes (public) =="
curl -s "$BASE_URL/api/products/$PRODUCT_ID"
echo ""

echo ""
echo "== 7. Ajouter au panier (client) =="
curl -s -X POST "$BASE_URL/api/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d "{\"productId\":$PRODUCT_ID,\"grade\":\"A\",\"quantity\":1}"
echo ""

echo ""
echo "== 8. Voir le panier =="
curl -s "$BASE_URL/api/cart" -H "Authorization: Bearer $CLIENT_TOKEN"
echo ""

echo ""
echo "== 9. Valider la commande (checkout) =="
curl -s -X POST "$BASE_URL/api/orders" -H "Authorization: Bearer $CLIENT_TOKEN"
echo ""

echo ""
echo "== 10. Historique de pricing (ADMIN, vide tant que le microservice FastAPI n'a pas tourné) =="
curl -s "$BASE_URL/api/admin/pricing/history" -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""

echo ""
echo "Terminé."
