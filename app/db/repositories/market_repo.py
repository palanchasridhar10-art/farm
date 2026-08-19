"""Repository for market-related database queries."""

from sqlalchemy.orm import Session
from app.db.models.market import Market


def get_markets_by_district(db: Session, district_id: int, active_only: bool = True):
    q = db.query(Market).filter(Market.district_id == district_id)
    if active_only:
        q = q.filter(Market.is_active == True)
    return q.order_by(Market.name).all()


def get_market_by_slug(db: Session, district_id: int, slug: str):
    return (
        db.query(Market)
        .filter(Market.district_id == district_id, Market.slug == slug)
        .first()
    )


def get_market_by_id(db: Session, market_id: int):
    return db.query(Market).filter(Market.id == market_id).first()


def get_all_markets(db: Session, active_only: bool = True):
    q = db.query(Market)
    if active_only:
        q = q.filter(Market.is_active == True)
    return q.order_by(Market.name).all()


def get_primary_market_for_district(db: Session, district_id: int):
    """Return the first active market in a district (primary/main market)."""
    return (
        db.query(Market)
        .filter(Market.district_id == district_id, Market.is_active == True)
        .order_by(Market.id)
        .first()
    )
