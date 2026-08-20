"""Price service handling latest observations, historical series, and trend calculations."""

from sqlalchemy.orm import Session
from app.db.repositories import district_repo, market_repo, commodity_repo, observation_repo
from app.utils.dates import calculate_freshness
from app.core.constants import TREND_LABELS


class PriceService:
    def get_latest(
        self,
        db: Session,
        commodity_name: str,
        district_name: str | None = None,
        market_name: str | None = None,
    ):
        comm = commodity_repo.resolve_commodity(db, commodity_name)
        if not comm:
            return {"error": f"Commodity '{commodity_name}' not found."}

        target_market = None
        target_district = None

        if district_name:
            target_district = district_repo.get_district_by_slug(
                db, district_name
            ) or district_repo.get_district_by_name(db, district_name)

        if market_name and target_district:
            # Try slug lookup first, then name
            target_market = market_repo.get_market_by_slug(
                db, target_district.id, market_name
            )
            if not target_market:
                # market_name might be the full name — find by name
                all_markets = market_repo.get_markets_by_district(db, target_district.id)
                for m in all_markets:
                    if m.name.lower() == market_name.lower() or m.slug == market_name:
                        target_market = m
                        break

        if not target_market and target_district:
            target_market = market_repo.get_primary_market_for_district(
                db, target_district.id
            )

        if target_market:
            obs = observation_repo.get_latest_observation(
                db, comm.id, target_market.id
            )
        elif target_district:
            obs = observation_repo.get_latest_by_district(
                db, comm.id, target_district.id
            )
            if obs:
                target_market = market_repo.get_market_by_id(db, obs.market_id)
        else:
            districts = district_repo.get_all_districts(db)
            if districts:
                target_district = districts[0]
                target_market = market_repo.get_primary_market_for_district(
                    db, target_district.id
                )
                obs = (
                    observation_repo.get_latest_observation(
                        db, comm.id, target_market.id
                    )
                    if target_market
                    else None
                )
            else:
                obs = None

        if not obs:
            return {
                "error": "No verified price record found for this selection.",
                "commodity": comm.canonical_name,
                "district": target_district.name if target_district else "Telangana",
            }

        freshness = calculate_freshness(obs.observation_date)

        # Get historical 7-day trend
        history_7d = observation_repo.get_history(
            db, comm.id, obs.market_id, days=7
        )
        trend_pct = 0.0
        trend_label = "Stable →"
        if len(history_7d) >= 2:
            prev_price = float(history_7d[0].modal_price)
            curr_price = float(obs.modal_price)
            if prev_price > 0:
                trend_pct = round(
                    ((curr_price - prev_price) / prev_price) * 100.0, 2
                )
                if trend_pct >= 2.0:
                    trend_label = "Rising ↑"
                elif trend_pct <= -2.0:
                    trend_label = "Falling ↓"

        return {
            "data": {
                "commodity_id": comm.id,
                "commodity": comm.canonical_name,
                "commodity_te": comm.local_name_te,
                "district": (
                    target_district.name
                    if target_district
                    else (
                        obs.market.district.name
                        if obs.market and obs.market.district
                        else "Telangana"
                    )
                ),
                "district_slug": (
                    target_district.slug
                    if target_district
                    else (
                        obs.market.district.slug
                        if obs.market and obs.market.district
                        else "telangana"
                    )
                ),
                "market": target_market.name if target_market else "Primary Mandi",
                "modal_price": float(obs.modal_price),
                "min_price": (
                    float(obs.min_price)
                    if obs.min_price
                    else float(obs.modal_price * 0.95)
                ),
                "max_price": (
                    float(obs.max_price)
                    if obs.max_price
                    else float(obs.modal_price * 1.05)
                ),
                "arrival_quantity": float(obs.arrival_quantity or 0.0),
                "unit": obs.price_unit or "INR/quintal",
                "trend_7d_pct": trend_pct,
                "trend_label": trend_label,
            },
            "meta": {
                "observation_date": obs.observation_date.isoformat(),
                "freshness": freshness["status"],
                "freshness_label": freshness["label"],
                "days_ago": freshness["days_ago"],
                "source": "e-NAM APMC / Mandi Verified Feed",
            },
        }

    def get_history(
        self, db: Session, commodity_name: str, district_name: str, days: int = 30,
        market_slug: str | None = None,
    ):
        comm = commodity_repo.resolve_commodity(db, commodity_name)
        if not comm:
            return {
                "error": f"Commodity '{commodity_name}' not found.",
                "series": [],
            }

        dist = district_repo.get_district_by_slug(
            db, district_name
        ) or district_repo.get_district_by_name(db, district_name)
        if not dist:
            return {
                "error": f"District '{district_name}' not found.",
                "series": [],
            }

        target_market = None
        if market_slug:
            target_market = market_repo.get_market_by_slug(db, dist.id, market_slug)
            if not target_market:
                # Fallback: try matching by name
                all_markets = market_repo.get_markets_by_district(db, dist.id)
                for m in all_markets:
                    if m.slug == market_slug or m.name.lower() == market_slug.lower():
                        target_market = m
                        break

        if target_market:
            history = observation_repo.get_history(db, comm.id, target_market.id, days=days)
        else:
            history = observation_repo.get_history_by_district(
                db, comm.id, dist.id, days=days
            )

        series = [
            {
                "date": h.observation_date.isoformat(),
                "modal_price": float(h.modal_price),
                "min_price": float(h.min_price or h.modal_price * 0.95),
                "max_price": float(h.max_price or h.modal_price * 1.05),
                "arrival_quantity": float(h.arrival_quantity or 0.0),
                "market": target_market.name if target_market else None,
            }
            for h in history
        ]
        return {
            "commodity": comm.canonical_name,
            "district": dist.name,
            "market": target_market.name if target_market else None,
            "days": days,
            "series": series,
        }


price_service = PriceService()
