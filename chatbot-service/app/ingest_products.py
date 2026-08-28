"""
Indexe le catalogue produit dans ChromaDB : un chunk texte par produit,
avec le prix minimum et les grades/couleurs disponibles agrégés depuis
product_units. À relancer manuellement (POST /admin/reindex) après un
ajustement de prix ou un changement de catalogue important — pas besoin
de temps réel pour un chatbot de démo.

Usage : python -m app.ingest_products
"""

import psycopg2
from app import vector_store
from app.config import settings

PRODUCTS_QUERY = """
    SELECT id, name, brand, description, category, image_url
    FROM products
"""

VARIANTS_QUERY = """
    SELECT product_id, grade, color, MIN(current_price) AS min_price, COUNT(*) AS stock
    FROM product_units
    WHERE status = 'AVAILABLE'
    GROUP BY product_id, grade, color
"""


def _fetch_rows(query: str) -> list[dict]:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()


def _build_document(product: dict, variants: list[dict]) -> str:
    lines = [
        f"Produit : {product['name']}",
        f"Marque : {product['brand'] or 'non précisée'}",
        f"Catégorie : {product['category']}",
    ]
    if product["description"]:
        lines.append(f"Description : {product['description']}")

    if variants:
        prices = sorted({float(v["min_price"]) for v in variants})
        grades = sorted({v["grade"] for v in variants})
        lines.append(f"Grades disponibles : {', '.join(grades)}")
        lines.append(f"Prix à partir de {prices[0]:.2f} MAD (jusqu'à {prices[-1]:.2f} MAD selon le grade)")
        for v in variants:
            lines.append(
                f"- Grade {v['grade']}, couleur {v['color']} : {float(v['min_price']):.2f} MAD, "
                f"{v['stock']} unité(s) en stock"
            )
    else:
        lines.append("Actuellement en rupture de stock sur tous les grades.")

    return "\n".join(lines)


def run() -> None:
    vector_store.delete_by_type("product")

    products = _fetch_rows(PRODUCTS_QUERY)
    variant_rows = _fetch_rows(VARIANTS_QUERY)

    variants_by_product: dict[int, list[dict]] = {}
    for v in variant_rows:
        variants_by_product.setdefault(v["product_id"], []).append(v)

    if not products:
        print("Aucun produit trouvé — vérifie DATABASE_URL et que le backend a bien seedé des données.")
        return

    ids, texts, metadatas = [], [], []
    for product in products:
        variants = variants_by_product.get(product["id"], [])
        min_price = min((float(v["min_price"]) for v in variants), default=None)

        ids.append(f"product:{product['id']}")
        texts.append(_build_document(product, variants))
        metadatas.append(
            {
                "type": "product",
                "product_id": product["id"],
                "name": product["name"],
                "brand": product["brand"] or "",
                "image_url": product["image_url"] or "",
                "min_price": min_price if min_price is not None else -1,
            }
        )

    vector_store.upsert(ids, texts, metadatas)
    print(f"{len(products)} produit(s) indexé(s).")


if __name__ == "__main__":
    run()
