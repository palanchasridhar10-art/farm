"""District, market, and commodity listing endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.repositories import district_repo, market_repo, commodity_repo

router = APIRouter(prefix="/api/v1", tags=["markets"])

@router.get("/districts")
def list_districts(db: Session = Depends(get_db)):
    districts = district_repo.get_all_districts(db)
    return [{"id": d.id, "name": d.name, "slug": d.slug, "state": d.state} for d in districts]

@router.get("/markets")
def list_markets(district: str = Query(None), db: Session = Depends(get_db)):
    if district:
        dist = district_repo.get_district_by_slug(db, district) or district_repo.get_district_by_name(db, district)
        if not dist:
            return {"error": f"District '{district}' not found."}
        markets = market_repo.get_markets_by_district(db, dist.id)
    else:
        markets = market_repo.get_all_markets(db)
    return [{"id": m.id, "name": m.name, "slug": m.slug, "district_id": m.district_id} for m in markets]

@router.get("/commodities")
def list_commodities(db: Session = Depends(get_db)):
    commodities = commodity_repo.get_all_commodities(db)
    return [
        {
            "id": c.id,
            "canonical_name": c.canonical_name,
            "local_name_te": c.local_name_te,
            "category": c.category,
            "default_unit": c.default_unit,
            "aliases": [a.alias for a in c.aliases],
        }
        for c in commodities
    ]
