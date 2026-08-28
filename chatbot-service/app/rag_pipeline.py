from app import vector_store, groq_client
from app.models import ProductHit

SYSTEM_PROMPT = """Tu es l'assistant de Hajar Shop, une boutique en ligne \
d'électronique reconditionnée (smartphones, ordinateurs, audio).

Règles strictes :
- Réponds UNIQUEMENT à partir des informations fournies dans le contexte ci-dessous.
- Si le contexte ne permet pas de répondre, dis clairement que tu ne sais \
pas et invite la personne à consulter la boutique ou le support — n'invente jamais un prix, un stock ou une politique.
- Réponds en français, de façon concise et directe (quelques phrases).
- Ne mentionne jamais que tu es un modèle de langage ou que tu utilises un contexte : réponds naturellement, comme un conseiller de la boutique.
"""


def _format_context(hits: list[dict]) -> str:
    if not hits:
        return "(aucune information pertinente trouvée)"
    return "\n\n---\n\n".join(h["text"] for h in hits)


def _extract_products(hits: list[dict]) -> list[ProductHit]:
    products = []
    for h in hits:
        meta = h["metadata"]
        if meta.get("type") != "product":
            continue
        products.append(
            ProductHit(
                id=meta["product_id"],
                name=meta["name"],
                brand=meta.get("brand") or None,
                image_url=meta.get("image_url") or None,
                min_price=meta["min_price"] if meta.get("min_price", -1) >= 0 else None,
            )
        )
    return products


def answer(question: str, history: list[dict] | None = None) -> tuple[str, list[ProductHit]]:
    hits = vector_store.query(question, n_results=4)
    context = _format_context(hits)

    user_prompt = f"Contexte :\n{context}\n\nQuestion du client : {question}"
    reply = groq_client.complete(SYSTEM_PROMPT, user_prompt, history=history)

    return reply, _extract_products(hits)
