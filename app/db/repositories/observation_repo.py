"""Repository for market observation queries."""

from datetime import date, timedelta
from sqlalchemy import desc, func
from sqlalchemy.orm import Session
from app.db.models.market_observation import MarketObservation
from app.db.models.market import Market


def get_latest_observation(db: Session, commodity_id: int, market_id: int):
    """Return the most recent observation for a commodity at a specific market."""
    return (
        db.query(MarketObservation)
        .filter(
            MarketObservation.commodity_id == commodity_id,
            MarketObservation.market_id == market_id,
            MarketObservation.data_quality_status == "validated",
        )
        .order_by(desc(MarketObservation.observation_date))
        .first()
    )


def get_latest_by_district(db: Session, commodity_id: int, district_id: int):
    """Return the most recent observation for a commodity in any market of a district."""
    return (
        db.query(MarketObservation)
        .join(Market, MarketObservation.market_id == Market.id)
        .filter(
            MarketObservation.commodity_id == commodity_id,
            Market.district_id == district_id,
            MarketObservation.data_quality_status == "validated",
        )
        .order_by(desc(MarketObservation.observation_date))
        .first()
    )


def get_history(db: Session, commodity_id: int, market_id: int, days: int = 30):
    """Return historical observations for charting."""
    cutoff = date.today() - timedelta(days=days)
    return (
        db.query(MarketObservation)
        .filter(
            MarketObservation.commodity_id == commodity_id,
            MarketObservation.market_id == market_id,
            MarketObservation.observation_date >= cutoff,
            MarketObservation.data_quality_status == "validated",
        )
        .order_by(MarketObservation.observation_date)
        .all()
    )


def get_history_by_district(db: Session, commodity_id: int, district_id: int, days: int = 30):
    """Return historical observations across all markets in a district."""
    cutoff = date.today() - timedelta(days=days)
    return (
        db.query(MarketObservation)
        .join(Market, MarketObservation.market_id == Market.id)
        .filter(
            MarketObservation.commodity_id == commodity_id,
            Market.district_id == district_id,
            MarketObservation.observation_date >= cutoff,
            MarketObservation.data_quality_status == "validated",
        )
        .order_by(MarketObservation.observation_date)
        .all()
    )


def get_all_series(db: Session, commodity_id: int, market_id: int):
    """Return full observation series for ML training."""
    return (
        db.query(MarketObservation)
        .filter(
            MarketObservation.commodity_id == commodity_id,
            MarketObservation.market_id == market_id,
            MarketObservation.data_quality_status == "validated",
        )
        .order_by(MarketObservation.observation_date)
        .all()
    )


def get_latest_across_districts(db: Session, commodity_id: int, district_ids: list[int]):
    """Return latest observation per district for comparison."""
    results = []
    for did in district_ids:
        obs = get_latest_by_district(db, commodity_id, did)
        if obs:
            results.append(obs)
    return results


def get_observation_count(db: Session):
    """Total validated observations in the database."""
    return (
        db.query(func.count(MarketObservation.id))
        .filter(MarketObservation.data_quality_status == "validated")
        .scalar()
    )
