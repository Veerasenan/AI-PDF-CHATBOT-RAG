from app.core.vector_store import get_vector_store
from app.core.llm import get_llm
from app.config.prompts import RAG_PROMPT
from app.utils.logger import setup_logger

logger = setup_logger()

def rag_pipeline(question: str, document_ids=None):
    try:
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        
        llm = get_llm()
        
        # Simple retrieval + LLM call
        docs = retriever.get_relevant_documents(question)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        prompt = RAG_PROMPT.format(context=context, question=question)
        
        response = llm.invoke(prompt)
        
        sources = [doc.metadata.get("source", "Unknown") for doc in docs]
        
        logger.info(f"Answered question: {question[:80]}...")
        
        return {
            "answer": response.content if hasattr(response, 'content') else str(response),
            "sources": list(set(sources))  # Remove duplicates
        }
    except Exception as e:
        logger.error(f"RAG Pipeline Error: {str(e)}")
        return {
            "answer": "Sorry, I encountered an error while processing your question.",
            "sources": []
        }