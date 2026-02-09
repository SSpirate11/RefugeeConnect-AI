from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import shutil
from app.services.gemini_service import gemini_service
from app.models import Credential
from app.schemas import CredentialUploadResponse
from app.services.pdf_service import pdf_service
from app.schemas_pdf import PortfolioRequest
from fastapi.responses import Response
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"

@router.post("/portfolio")
async def generate_portfolio(request: PortfolioRequest):
    pdf_buffer = pdf_service.generate_portfolio(request.analysis, request.mapping)
    return Response(content=pdf_buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=portfolio.pdf"})

@router.post("/upload", response_model=CredentialUploadResponse)
async def upload_credential(file: UploadFile = File(...)):
    # 1. Validate file validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # 2. Save file locally
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Create DB record (TODO: Database integration later, just mocking ID now)
    credential_id = uuid.uuid4()
    
    # 4. Trigger Gemini Analysis (Sync for MVP)
    analysis_json = await gemini_service.analyze_credential_image(file_path)

    # 5. Trigger Curriculum Mapping (Chained reasoning)
    # Parse the vision output to pass to reasoning
    import json
    try:
        if isinstance(analysis_json, str):
            vision_data = json.loads(analysis_json)
        else:
            vision_data = analysis_json # Handle mock dict return
            
        mapping_result = await gemini_service.map_curriculum(vision_data, target_country="Germany") # Defaults to Germany for MVP
    except Exception as e:
        print(f"Mapping Failed: {e}")
        mapping_result = {"error": "Mapping failed"}

    response_data = {
        "message": "Credential uploaded and analyzed successfully",
        "credential_id": credential_id,
        "filename": new_filename,
        "analysis": analysis_json,
        "mapping": mapping_result
    }
    print(f"DEBUG: Credentials Response: {response_data}")
    return response_data
