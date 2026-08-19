"""Database session factory and FastAPI dependency."""

from sqlalchemy.orm import Session, sessionmaker
from app.db.base import engine

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    """FastAPI dependency that yields a DB session and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
