"""Deterministic backend tools for the AI chatbot."""

from sqlalchemy.orm import Session
from app.services.price_service import price_service
from app.services.forecast_service import forecast_service
from app.services.commodity_service import commodity_service
from app.services.recommendation_service import recommendation_service
from app.db.repositories import district_repo

def tool_get_current_price(db: Session, commodity: str, district: str | None = None) -> dict:
    return price_service.get_latest(db, commodity, district)

def tool_get_forecast(db: Session, commodity: str, district: str | None = None, horizon_days: int = 7) -> dict:
    if not district:
        district = "nalgonda"
    return forecast_service.get_forecast(db, commodity, district, horizon_days)

def tool_compare_markets(db: Session, commodity: str) -> dict:
    return forecast_service.compare_markets(db, commodity)

def tool_find_best_market(db: Session, commodity: str) -> dict:
    return recommendation_service.calculate_market_opportunity(db, commodity)

def tool_list_supported_commodities(db: Session) -> list[dict]:
    return commodity_service.get_all(db)

def tool_list_supported_districts(db: Session) -> list[str]:
    return [d.name for d in district_repo.get_all_districts(db)]
