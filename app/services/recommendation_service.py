"""Recommendation service for transparent Market Opportunity Scoring."""

from sqlalchemy.orm import Session
from app.services.forecast_service import forecast_service

class RecommendationService:
    def calculate_market_opportunity(self, db: Session, commodity_name: str, current_district: str | None = None):
        res = forecast_service.compare_markets(db, commodity_name)
        comparisons = res.get("comparisons", [])
        if not comparisons:
            return {"error": "No markets available for scoring."}

        max_price = max(c["current_modal_price"] for c in comparisons) or 1.0

        recommendations = []
        for c in comparisons:
            price_score = (c["current_modal_price"] / max_price) * 50.0
            forecast_score = (c["forecast_7d"] / max_price) * 35.0
            freshness_score = 15.0  # full weight for verified recent observations

            opportunity_score = round(price_score + forecast_score + freshness_score, 1)

            recommendations.append({
                "district": c["district"],
                "district_slug": c["district_slug"],
                "market": c["market"],
                "current_price": c["current_modal_price"],
                "forecast_7d": c["forecast_7d"],
                "opportunity_score": opportunity_score,
                "note": "Higher gross mandi realization. Transport, handling, and market fees should be factored in.",
            })

        recommendations.sort(key=lambda x: x["opportunity_score"], reverse=True)
        return {
            "commodity": res["commodity"],
            "commodity_te": res.get("commodity_te"),
            "best_opportunity": recommendations[0] if recommendations else None,
            "rankings": recommendations,
        }

recommendation_service = RecommendationService()
