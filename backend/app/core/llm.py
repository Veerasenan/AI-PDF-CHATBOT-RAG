from langchain_google_genai import ChatGoogleGenerativeAI

from app.config.settings import settings


def get_llm():

    if not settings.GOOGLE_API_KEY:
        raise ValueError(
            "Google Gemini API Key is not configured."
        )

    return ChatGoogleGenerativeAI(
        model=settings.MODEL_NAME,
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.3,
    )