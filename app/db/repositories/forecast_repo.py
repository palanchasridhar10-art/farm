"""Repository for forecast queries."""

from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.db.models.forecast import Forecast
from app.db.models.market import Market


def get_latest_forecast(db: Session, commodity_id: int, market_id: int, horizon_days: int):
    """Return the most recent forecast for a given commodity/market/horizon."""
    return (
        db.query(Forecast)
        .filter(
            Forecast.commodity_id == commodity_id,
            Forecast.market_id == market_id,
            Forecast.horizon_days == horizon_days,
        )
        .order_by(desc(Forecast.generated_at))
        .first()
    )


def get_forecasts_for_commodity(db: Session, commodity_id: int, market_id: int):
    """Return all latest horizons for a commodity/market."""
    from app.core.constants import FORECAST_HORIZONS

    results = []
    for h in FORECAST_HORIZONS:
        f = get_latest_forecast(db, commodity_id, market_id, h)
        if f:
            results.append(f)
    return results


def get_forecasts_by_district(db: Session, commodity_id: int, district_id: int):
    """Get latest forecast for a commodity across all markets in a district."""
    markets = (
        db.query(Market)
        .filter(Market.district_id == district_id, Market.is_active == True)
        .all()
    )
    results = []
    for m in markets:
        forecasts = get_forecasts_for_commodity(db, commodity_id, m.id)
        if forecasts:
            results.append({"market": m, "forecasts": forecasts})
    return results
