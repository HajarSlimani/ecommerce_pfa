from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import ChatRequest, ChatResponse
from app import rag_pipeline, ingest_docs, ingest_products

app = FastAPI(title="Hajar Shop — Chatbot RAG")

# Le frontend Vite appelle ce service directement (pas de proxy via le
# backend Spring) : il faut donc autoriser son origine explicitement.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not settings.groq_api_key:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY manquante côté serveur — voir chatbot-service/.env.example",
        )

    history = [{"role": m.role, "content": m.content} for m in request.history]
    try:
        reply, products = rag_pipeline.answer(request.message, history=history)
    except Exception as exc:  # noqa: BLE001 — on veut un message propre côté client dans tous les cas
        raise HTTPException(status_code=502, detail=f"Échec de l'appel au moteur RAG : {exc}") from exc

    return ChatResponse(answer=reply, products=products)


@app.post("/admin/reindex")
def reindex():
    """
    Ré-ingère la FAQ statique et le catalogue produit dans l'index vectoriel.
    Pas d'authentification ici : le service n'est pas exposé publiquement
    (usage interne / démo). À sécuriser avant tout déploiement réel.
    """
    ingest_docs.run()
    ingest_products.run()
    return {"status": "reindexed"}
