import os
from langchain_community.vectorstores import Chroma
from app.core.embeddings import get_embeddings
from app.config.settings import settings
from app.utils.logger import setup_logger

logger = setup_logger()
_vector_store = None

def get_vector_store():
    global _vector_store
    if _vector_store is None:
        try:
            embeddings = get_embeddings()
            persist_directory = settings.CHROMA_DB_PATH
            os.makedirs(persist_directory, exist_ok=True)
            
            _vector_store = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings
            )
            logger.info("Vector store initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            raise
    return _vector_store