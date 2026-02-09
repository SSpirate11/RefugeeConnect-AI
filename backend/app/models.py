from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str # New field for auth
    full_name: str
    nationality: Optional[str] = None
    current_country: Optional[str] = None
    registered_at: datetime = Field(default_factory=datetime.utcnow)

class Credential(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    original_filename: str
    file_path: Optional[str] = None # Added specifically for local file handling
    extracted_text: Optional[str] = None
    analysis_json: Optional[str] = None 
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NavigatorProfile(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", unique=True)
    profile_json: str # Storing the JSON life graph as a string
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
