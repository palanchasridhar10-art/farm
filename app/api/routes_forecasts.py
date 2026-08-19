"""Forecast and comparison endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.forecast_service import forecast_service

router = APIRouter(prefix="/api/v1", tags=["forecasts"])

@router.get("/forecast")
def get_forecast(
    commodity: str = Query(...),
    district: str = Query("nalgonda"),
    horizon: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db),
):
    return forecast_service.get_forecast(db, commodity, district, horizon)

@router.get("/compare")
def compare_markets(
    commodity: str = Query(...),
    districts: str = Query(None, description="Comma-separated district slugs"),
    db: Session = Depends(get_db),
):
    slugs = [s.strip() for s in districts.split(",")] if districts else None
    return forecast_service.compare_markets(db, commodity, slugs)
