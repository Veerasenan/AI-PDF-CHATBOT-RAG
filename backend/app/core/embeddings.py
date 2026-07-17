from langchain_openai import OpenAIEmbeddings
from app.config.settings import settings

def get_embeddings():
    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key is not set in .env file")
    
    return OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY
    )