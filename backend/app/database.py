from sqlmodel import SQLModel, create_engine, Session
import os
import logging

logger = logging.getLogger(__name__)

# For local development without Docker, use SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./refugeeconnect.db")

try:
    engine = create_engine(DATABASE_URL, echo=False)
    logger.info(f"Database connected: {DATABASE_URL}")
except Exception as e:
    logger.warning(f"Database connection failed: {e}. Using in-memory fallback.")
    # Fallback to SQLite in-memory for demo purposes
    engine = create_engine("sqlite:///:memory:", echo=False)

def create_db_and_tables():
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        logger.warning(f"Could not create database tables: {e}")

def get_session():
    with Session(engine) as session:
        yield session
