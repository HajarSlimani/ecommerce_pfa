# Chatbot RAG — Hajar Shop

Microservice FastAPI indépendant qui répond aux questions clients (produits
+ support) en s'appuyant sur une recherche sémantique dans le catalogue et
la FAQ, puis en faisant rédiger la réponse par un LLM gratuit hébergé
(Groq).

## Pourquoi cette stack

- **Recherche** (embeddings + ChromaDB) : 100% locale, tourne sur CPU,
  aucune clé API. C'est la partie qui a vraiment besoin d'être fiable et
  rapide.
- **Génération** (Groq) : gratuite, très rapide, évite de dépendre de la
  puissance de calcul de la machine de démo. Nécessite une connexion
  internet le jour de la soutenance.

## Installation

```bash
cd chatbot-service
python -m venv venv
source venv/bin/activate  # Windows : venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Éditer .env : coller une clé gratuite depuis https://console.groq.com/keys
```

## Indexer les données (à refaire après un changement de catalogue)

```bash
python -m app.ingest_docs       # garantie, retours, livraison, grades, commandes
python -m app.ingest_products   # catalogue produit depuis Postgres
```

Le backend Spring Boot et Postgres (docker-compose à la racine du repo)
doivent être lancés et seedés avant `ingest_products`, sinon l'index produit
sera vide.

## Lancer le service

```bash
uvicorn app.main:app --reload --port 8001
```

Vérifier que ça répond : `curl http://localhost:8001/health`

## Tester le chat sans le frontend

```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Quelle est la garantie sur un produit grade B ?"}'
```

## Avant la soutenance

- Relancer `POST /admin/reindex` si le catalogue a changé récemment.
- Vérifier la connexion internet de la salle (Groq est un appel réseau).
- Tester une dizaine de questions types la veille pour repérer les trous
  dans la FAQ ou des réponses maladroites.
