import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")

    MODEL_NAME: str = os.getenv(
        "MODEL_NAME",
        "gemini-2.5-flash"
    )

    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL",
        "models/text-embedding-004"
    )

    CHROMA_DB_PATH: str = "../data/chroma_db"

    UPLOAD_DIR: str = "../data/uploaded_pdfs"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()