"""Commodity service for listing, searching, and metadata resolution."""

from sqlalchemy.orm import Session
from app.db.repositories import commodity_repo

class CommodityService:
    def get_all(self, db: Session):
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

    def resolve(self, db: Session, query_text: str):
        return commodity_repo.resolve_commodity(db, query_text)

commodity_service = CommodityService()
