from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
from app.services.pdf_processor import process_pdf
from app.config.settings import settings
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()

@router.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process the PDF
        doc_id = process_pdf(file_path)
        
        return JSONResponse(content={
            "message": "PDF uploaded and processed successfully",
            "document_id": doc_id,
            "filename": file.filename
        })
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))