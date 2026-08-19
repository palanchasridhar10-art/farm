"""Forecast service retrieving predictions and cross-market comparisons."""

from sqlalchemy.orm import Session
from app.db.repositories import (
    district_repo,
    market_repo,
    commodity_repo,
    forecast_repo,
    observation_repo,
)
from app.services.price_service import price_service


class ForecastService:
    def get_forecast(
        self,
        db: Session,
        commodity_name: str,
        district_name: str,
        horizon_days: int = 7,
    ):
        comm = commodity_repo.resolve_commodity(db, commodity_name)
        if not comm:
            return {"error": f"Commodity '{commodity_name}' not found."}

        dist = district_repo.get_district_by_slug(
            db, district_name
        ) or district_repo.get_district_by_name(db, district_name)
        if not dist:
            return {"error": f"District '{district_name}' not found."}

        market = market_repo.get_primary_market_for_district(db, dist.id)
        if not market:
            return {"error": "No active market found in this district."}

        latest_price_res = price_service.get_latest(
            db, comm.canonical_name, dist.slug
        )
        forecasts = forecast_repo.get_forecasts_for_commodity(
            db, comm.id, market.id
        )

        forecast_list = []
        for f in forecasts:
            forecast_list.append(
                {
                    "horizon_days": f.horizon_days,
                    "forecast_date": f.forecast_date.isoformat(),
                    "predicted_price": float(f.predicted_price),
                    "lower_bound": float(
                        f.lower_bound or f.predicted_price * 0.95
                    ),
                    "upper_bound": float(
                        f.upper_bound or f.predicted_price * 1.05
                    ),
                    "confidence_score": float(f.confidence_score or 0.85),
                    "model_name": f.model_name,
                    "model_version": f.model_version,
                }
            )

        return {
            "commodity": comm.canonical_name,
            "commodity_te": comm.local_name_te,
            "district": dist.name,
            "district_slug": dist.slug,
            "market": market.name,
            "current_observation": latest_price_res.get("data", {}),
            "forecasts": forecast_list,
            "confidence_label": "Medium to High",
            "disclaimer": "This is a machine-learning estimate based on historical mandi patterns, not a guaranteed contractual price.",
        }

    def compare_markets(
        self,
        db: Session,
        commodity_name: str,
        district_slugs: list[str] | None = None,
    ):
        comm = commodity_repo.resolve_commodity(db, commodity_name)
        if not comm:
            return {
                "error": f"Commodity '{commodity_name}' not found.",
                "comparisons": [],
            }

        all_districts = district_repo.get_all_districts(db)
        if district_slugs:
            districts = [d for d in all_districts if d.slug in district_slugs]
        else:
            districts = all_districts

        comparisons = []
        for dist in districts:
            market = market_repo.get_primary_market_for_district(db, dist.id)
            if not market:
                continue

            obs = observation_repo.get_latest_observation(db, comm.id, market.id)
            f7 = forecast_repo.get_latest_forecast(
                db, comm.id, market.id, horizon_days=7
            )

            if obs:
                modal = float(obs.modal_price)
                pred_7d = (
                    float(f7.predicted_price)
                    if f7
                    else round(modal * 1.02, 2)
                )
                comparisons.append(
                    {
                        "district": dist.name,
                        "district_slug": dist.slug,
                        "market": market.name,
                        "current_modal_price": modal,
                        "min_price": float(obs.min_price or modal * 0.95),
                        "max_price": float(obs.max_price or modal * 1.05),
                        "forecast_7d": pred_7d,
                        "observation_date": obs.observation_date.isoformat(),
                        "confidence": (
                            "High"
                            if (f7 and f7.confidence_score and f7.confidence_score > 0.88)
                            else "Medium"
                        ),
                    }
                )

        # Rank by current modal price descending
        comparisons.sort(key=lambda x: x["current_modal_price"], reverse=True)
        for idx, item in enumerate(comparisons):
            item["rank"] = idx + 1

        return {
            "commodity": comm.canonical_name,
            "commodity_te": comm.local_name_te,
            "comparisons": comparisons,
            "best_current_market": comparisons[0] if comparisons else None,
        }


forecast_service = ForecastService()
