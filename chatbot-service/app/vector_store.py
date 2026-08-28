"""
Index vectoriel ChromaDB en mode embarqué (fichier local, pas de service à
lancer). Une seule collection "knowledge" avec un champ de métadonnée
`type` ("product" | "faq") pour pouvoir filtrer ou simplement distinguer les
résultats après coup.
"""

from functools import lru_cache
from app.config import settings
from app.embeddings import embed, embed_one

COLLECTION_NAME = "knowledge"


@lru_cache(maxsize=1)
def _get_client():
    import chromadb
    from chromadb.config import Settings as ChromaSettings

    return chromadb.PersistentClient(
        path=settings.chroma_persist_dir,
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def _get_collection():
    client = _get_client()
    return client.get_or_create_collection(COLLECTION_NAME)


def upsert(ids: list[str], texts: list[str], metadatas: list[dict]) -> None:
    if not ids:
        return
    collection = _get_collection()
    collection.upsert(ids=ids, embeddings=embed(texts), documents=texts, metadatas=metadatas)


def delete_by_type(doc_type: str) -> None:
    """Vide une catégorie avant réingestion (ex. repartir de zéro sur les
    produits sans toucher aux docs de FAQ)."""
    collection = _get_collection()
    collection.delete(where={"type": doc_type})


def query(text: str, n_results: int = 4) -> list[dict]:
    collection = _get_collection()
    result = collection.query(query_embeddings=[embed_one(text)], n_results=n_results)

    hits = []
    ids = result.get("ids", [[]])[0]
    docs = result.get("documents", [[]])[0]
    metas = result.get("metadatas", [[]])[0]
    for doc_id, doc, meta in zip(ids, docs, metas):
        hits.append({"id": doc_id, "text": doc, "metadata": meta})
    return hits
