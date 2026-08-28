from typing import Literal, Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    # Historique court envoyé par le frontend pour garder le fil de la
    # conversation — pas de session persistée côté serveur, tout vit dans
    # l'état React (voir useChat côté frontend). Suffisant pour une démo.
    history: list[ChatMessage] = []


class ProductHit(BaseModel):
    id: int
    name: str
    brand: Optional[str] = None
    image_url: Optional[str] = None
    min_price: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    # Produits retrouvés par la recherche sémantique et utilisés comme
    # contexte — affichés en frontend sous forme de mini-cartes cliquables,
    # indépendamment de ce que le LLM a explicitement cité dans sa réponse
    # (plus fiable qu'un parsing de marqueurs générés par un petit modèle).
    products: list[ProductHit] = []
