import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.vector_store import get_vector_store
from app.utils.logger import setup_logger

logger = setup_logger()

def process_pdf(file_path: str):
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        chunks = text_splitter.split_documents(documents)
        
        vector_store = get_vector_store()
        vector_store.add_documents(chunks)
        
        logger.info(f"Successfully processed {os.path.basename(file_path)} - {len(chunks)} chunks")
        return os.path.basename(file_path)
        
    except Exception as e:
        logger.error(f"PDF Processing failed: {str(e)}")
        raise