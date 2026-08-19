"""Health check endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.repositories import observation_repo
from app.core.config import settings

router = APIRouter(prefix="/api/v1", tags=["health"])

@router.get("/health")
def health(db: Session = Depends(get_db)):
    obs_count = observation_repo.get_observation_count(db)
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "database": "connected",
        "total_observations": obs_count,
        "llm_configured": settings.llm_available,
    }
