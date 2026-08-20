"""Repository for district-related database queries."""

from sqlalchemy.orm import Session
from app.db.models.district import District


DISTRICT_SLUG_SYNONYMS = {
    "hanumakonda": "hanamkonda",
    "kumuram-bheem-asifabad": "komaram-bheem-asifabad",
    "kumuram-bheem": "komaram-bheem-asifabad",
    "komaram-bheem": "komaram-bheem-asifabad",
    "asifabad": "komaram-bheem-asifabad",
    "gadwal": "jogulamba-gadwal",
    "kothagudem": "bhadradri-kothagudem",
    "bhupalpally": "jayashankar-bhupalpally",
    "sircilla": "rajanna-sircilla",
    "malkajgiri": "medchal-malkajgiri",
    "bhuvanagiri": "yadadri-bhuvanagiri",
    "bhongir": "yadadri-bhuvanagiri",
}


def get_all_districts(db: Session, active_only: bool = True):
    q = db.query(District)
    if active_only:
        q = q.filter(District.is_active == True)
    return q.order_by(District.name).all()


def get_district_by_slug(db: Session, slug: str):
    norm = slug.lower().strip().replace(" ", "-").replace("_", "-")
    canonical_slug = DISTRICT_SLUG_SYNONYMS.get(norm, norm)
    return db.query(District).filter(
        (District.slug == canonical_slug) | (District.slug == norm)
    ).first()


def get_district_by_id(db: Session, district_id: int):
    return db.query(District).filter(District.id == district_id).first()


def get_district_by_name(db: Session, name: str):
    clean = name.strip()
    norm_slug = clean.lower().replace(" ", "-").replace("_", "-")
    canonical_slug = DISTRICT_SLUG_SYNONYMS.get(norm_slug, norm_slug)
    return db.query(District).filter(
        (District.name.ilike(clean))
        | (District.slug == canonical_slug)
        | (District.name.ilike(f"%{clean}%"))
    ).first()

