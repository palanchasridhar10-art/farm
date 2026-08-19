"""Repository for commodity-related database queries."""

from sqlalchemy.orm import Session
from app.db.models.commodity import Commodity
from app.db.models.commodity_alias import CommodityAlias


def get_all_commodities(db: Session, active_only: bool = True):
    q = db.query(Commodity)
    if active_only:
        q = q.filter(Commodity.is_active == True)
    return q.order_by(Commodity.category, Commodity.canonical_name).all()


def get_commodity_by_id(db: Session, commodity_id: int):
    return db.query(Commodity).filter(Commodity.id == commodity_id).first()


def get_commodity_by_name(db: Session, name: str):
    return db.query(Commodity).filter(Commodity.canonical_name.ilike(name)).first()


def resolve_commodity(db: Session, text: str):
    """Resolve a user-provided string to a Commodity via canonical name or alias."""
    text_lower = text.strip().lower()

    # Try canonical name first
    commodity = db.query(Commodity).filter(
        Commodity.canonical_name.ilike(text_lower)
    ).first()
    if commodity:
        return commodity

    # Try alias table
    alias = db.query(CommodityAlias).filter(
        CommodityAlias.alias.ilike(text_lower)
    ).first()
    if alias:
        return get_commodity_by_id(db, alias.commodity_id)

    return None


def get_commodities_by_category(db: Session, category: str):
    return (
        db.query(Commodity)
        .filter(Commodity.category.ilike(category), Commodity.is_active == True)
        .order_by(Commodity.canonical_name)
        .all()
    )
