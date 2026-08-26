"""
NLAMS Database Layer
Supports PostgreSQL / PostGIS with automatic SQLite fallback for local testing.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Fallback to local SQLite file database if DATABASE_URL is not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nlams.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
