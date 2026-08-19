"""Repository for district-related database queries."""

from sqlalchemy.orm import Session
from app.db.models.district import District


def get_all_districts(db: Session, active_only: bool = True):
    q = db.query(District)
    if active_only:
        q = q.filter(District.is_active == True)
    return q.order_by(District.name).all()


def get_district_by_slug(db: Session, slug: str):
    return db.query(District).filter(District.slug == slug).first()


def get_district_by_id(db: Session, district_id: int):
    return db.query(District).filter(District.id == district_id).first()


def get_district_by_name(db: Session, name: str):
    return db.query(District).filter(District.name.ilike(name)).first()
