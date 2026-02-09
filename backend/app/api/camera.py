from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_service
import uuid
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads"

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str
    confidence: float

@router.post("/translate", response_model=TranslationResponse)
async def translate_image(
    file: UploadFile = File(...),
    target_language: str = "English"
):
    """
    Camera Translation: Extract text from image and translate to target language
    Uses Gemini Vision for OCR + Translation in one pass
    """
    
    # 1. Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # 2. Save file temporarily
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 3. Call Gemini for OCR + Translation
        result = await gemini_service.translate_image(file_path, target_language)
        
        # 4. Cleanup temp file
        os.remove(file_path)
        
        return result
        
    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


class RealTimeTranslateRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

@router.post("/translate-text")
async def translate_text(request: RealTimeTranslateRequest):
    """
    Text-only translation for extracted text
    Useful for refining translations or re-translating
    """
    
    try:
        result = await gemini_service.translate_text(
            request.text,
            request.source_language,
            request.target_language
        )
        
        return {
            "original_text": request.text,
            "translated_text": result,
            "source_language": request.source_language,
            "target_language": request.target_language
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
