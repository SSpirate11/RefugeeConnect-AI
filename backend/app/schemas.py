from pydantic import BaseModel
from typing import Optional, Any
import uuid
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: uuid.UUID
    registered_at: datetime

class CredentialUploadResponse(BaseModel):
    message: str
    credential_id: uuid.UUID
    filename: str
    analysis: Any  # Can be dict or string (JSON)
    mapping: Any   # Can be dict or string (JSON)
