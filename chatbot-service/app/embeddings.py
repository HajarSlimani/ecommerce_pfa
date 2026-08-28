"""
Embeddings locaux via sentence-transformers — aucune clé API, tourne sur
CPU. Le modèle est chargé une seule fois (singleton paresseux) : le premier
appel télécharge ~90 Mo depuis Hugging Face et les met en cache localement,
les appels suivants sont instantanés et hors-ligne.

Chargement paresseux plutôt qu'au niveau du module : ça permet à l'API de
démarrer (et /health de répondre) même sans connexion internet ; seul un
vrai appel à /chat ou aux scripts d'ingestion déclenche le téléchargement.
"""

from functools import lru_cache

MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def _get_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(MODEL_NAME)


def embed(texts: list[str]) -> list[list[float]]:
    model = _get_model()
    return model.encode(texts, normalize_embeddings=True).tolist()


def embed_one(text: str) -> list[float]:
    return embed([text])[0]
