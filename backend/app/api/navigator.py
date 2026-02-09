from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.navigator_service import navigator_service
from app.api.auth import get_current_user
import uuid

router = APIRouter()

class OnboardRequest(BaseModel):
    conversation: str
    user_id: str = None

class AskRequest(BaseModel):
    query: str
    user_id: str

@router.post("/api/navigator/onboard")
async def onboard_user(request: OnboardRequest, current_user: dict = Depends(get_current_user)):
    """Extract Life Graph from onboarding conversation"""
    user_id = str(current_user.id)
    
    profile = await navigator_service.extract_life_graph(request.conversation, user_id)
    
    return {
        "user_id": user_id,
        "profile": profile,
        "message": "Profile created successfully"
    }

@router.get("/api/navigator/profile/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Retrieve authenticated user's Life Graph"""
    user_id = str(current_user.id)
    profile = await navigator_service.get_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"profile": profile}

@router.post("/api/navigator/ask")
async def ask_navigator(request: AskRequest, current_user: dict = Depends(get_current_user)):
    """Get form assistance based on query and profile"""
    user_id = str(current_user.id)
    profile = await navigator_service.get_profile(user_id)
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please complete onboarding first.")
    
    guidance = await navigator_service.get_form_assistance(request.query, user_id)
    
    return {
        "query": request.query,
        "guidance": guidance,
        "profile_used": profile
    }
