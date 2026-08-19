"""Price endpoints — latest and historical."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.price_service import price_service

router = APIRouter(prefix="/api/v1/prices", tags=["prices"])

@router.get("/latest")
def latest_price(
    commodity: str = Query(..., description="Commodity name or alias"),
    district: str = Query("nalgonda", description="District slug"),
    db: Session = Depends(get_db),
):
    return price_service.get_latest(db, commodity, district)

@router.get("/history")
def price_history(
    commodity: str = Query(...),
    district: str = Query("nalgonda"),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    return price_service.get_history(db, commodity, district, days)
