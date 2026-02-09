from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from contextlib import asynccontextmanager
from app.database import create_db_and_tables
from app.api import credentials, advocate, navigator, auth, camera

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="RefugeeConnect AI API", lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to RefugeeConnect AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(credentials.router, prefix="/api/credentials", tags=["credentials"])
app.include_router(camera.router, prefix="/api/camera", tags=["camera"])
app.include_router(advocate.router, tags=["advocate"])
app.include_router(navigator.router, tags=["navigator"])
