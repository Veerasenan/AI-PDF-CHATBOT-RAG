from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config.settings import settings


def get_embeddings():

    if not settings.GOOGLE_API_KEY:
        raise ValueError(
            "Google Gemini API Key is not configured."
        )

    return GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
    )