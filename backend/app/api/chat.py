from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.core.rag_pipeline import rag_pipeline
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()

class ChatRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []

@router.post("/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = rag_pipeline(request.question, request.document_ids)
        return ChatResponse(**response)
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing your question")