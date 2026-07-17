import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "gpt-4o-mini")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    CHROMA_DB_PATH: str = "../data/chroma_db"
    UPLOAD_DIR: str = "../data/uploaded_pdfs"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()