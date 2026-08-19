"""Date and freshness calculation helpers."""

from datetime import date, datetime
from app.core.constants import (
    FRESHNESS_VERIFIED_DAYS,
    FRESHNESS_RECENT_DAYS,
    FRESHNESS_STALE_DAYS,
    FRESHNESS_LABELS,
)

def calculate_freshness(obs_date: date | datetime | str) -> dict:
    """Calculates freshness badge and status based on observation date."""
    if isinstance(obs_date, str):
        try:
            obs_date = datetime.fromisoformat(obs_date.replace("Z", "")).date()
        except Exception:
            obs_date = date.today()
    elif isinstance(obs_date, datetime):
        obs_date = obs_date.date()

    today = date.today()
    days_old = (today - obs_date).days

    if days_old <= FRESHNESS_VERIFIED_DAYS:
        status = "verified"
    elif days_old <= FRESHNESS_RECENT_DAYS:
        status = "recent"
    elif days_old <= FRESHNESS_STALE_DAYS:
        status = "stale"
    else:
        status = "unavailable"

    return {
        "status": status,
        "days_ago": max(0, days_old),
        "label": FRESHNESS_LABELS.get(status, "Verified"),
    }
