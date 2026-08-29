from app import vector_store, groq_client
from app.models import ProductHit

SYSTEM_PROMPT = """Tu es l'assistant de Hajar Shop, une boutique en ligne \
d'électronique reconditionnée (smartphones, ordinateurs, audio).

Règles de contenu :
- Réponds UNIQUEMENT à partir des informations fournies dans le contexte ci-dessous.
- Si le contexte ne permet pas de répondre, dis clairement que tu ne sais \
pas et invite la personne à consulter la boutique ou le support — n'invente jamais un prix, un stock ou une politique.
- Le contexte ci-dessous est un EXTRAIT partiel du catalogue (les produits \
les plus pertinents pour la question), jamais la totalité. Ne fais AUCUNE \
affirmation sur les produits qui ne sont PAS dans le contexte : ne dis ni \
qu'ils existent, ni qu'ils sont en rupture, ni qu'ils sont indisponibles —
tu n'as simplement aucune information sur eux. Si la question porte sur \
l'ensemble du catalogue, dis que tu montres une sélection et invite à \
consulter la page Boutique du site pour la liste complète et à jour.

Règles de forme :
- Réponds en français, en 2 à 4 phrases de prose naturelle, jamais en \
liste à puces, tableau ou markdown, sauf si la personne demande \
explicitement le détail grade par grade ou couleur par couleur.
- Pour un produit avec plusieurs grades/couleurs, résume plutôt que \
d'énumérer : donne la fourchette de prix et le nombre de grades \
disponibles (ex. "disponible en 3 grades, de 190 à 320 MAD"), sans lister \
chaque combinaison grade/couleur/quantité une par une.
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
    # 6 plutôt que 4 : réduit le risque, sur une question large ("quels
    # produits avez-vous ?"), de ne retrouver qu'un ou deux produits et de
    # laisser croire au LLM que c'est tout le catalogue. Ça reste une
    # recherche par similarité, pas une requête SQL exhaustive — voir la
    # règle anti-généralisation dans SYSTEM_PROMPT ci-dessus pour la vraie
    # garde-fou contre ce genre d'erreur.
    hits = vector_store.query(question, n_results=6)
    context = _format_context(hits)

    user_prompt = f"Contexte :\n{context}\n\nQuestion du client : {question}"
    reply = groq_client.complete(SYSTEM_PROMPT, user_prompt, history=history)

    return reply, _extract_products(hits)
