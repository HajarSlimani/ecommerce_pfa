"""
Indexe les documents statiques (garantie, retours, livraison, grades,
cycle de commande) dans ChromaDB. Chaque fichier est assez court pour être
indexé d'un bloc — pas besoin de découpage (chunking) plus fin ici.

Usage : python -m app.ingest_docs
"""

from pathlib import Path
from app import vector_store

DOCS_DIR = Path(__file__).resolve().parent.parent / "data" / "docs"


def run() -> None:
    vector_store.delete_by_type("faq")

    files = sorted(DOCS_DIR.glob("*.md"))
    if not files:
        print(f"Aucun document trouvé dans {DOCS_DIR}")
        return

    ids, texts, metadatas = [], [], []
    for path in files:
        text = path.read_text(encoding="utf-8").strip()
        ids.append(f"faq:{path.stem}")
        texts.append(text)
        metadatas.append({"type": "faq", "source": path.stem})

    vector_store.upsert(ids, texts, metadatas)
    print(f"{len(files)} document(s) FAQ indexé(s) : {[f.stem for f in files]}")


if __name__ == "__main__":
    run()
