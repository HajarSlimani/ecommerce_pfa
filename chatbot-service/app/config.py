from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Centralise toute la config lue depuis .env. Un seul objet importé
    partout (`from app.config import settings`) plutôt que de relire
    os.environ un peu partout dans le code.
    """

    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-20b"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/ecommerce_db"
    chroma_persist_dir: str = "./chroma_data"
    allowed_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
