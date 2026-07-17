from langchain_openai import ChatOpenAI
from app.config.settings import settings

def get_llm():
    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key is not set in .env file")
    
    return ChatOpenAI(
        model_name=settings.MODEL_NAME,
        temperature=0.3,
        api_key=settings.OPENAI_API_KEY
    )