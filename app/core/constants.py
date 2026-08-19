"""Application-wide constants and enumerations."""

# ---------------------------------------------------------------------------
# Data freshness thresholds (in days)
# ---------------------------------------------------------------------------
FRESHNESS_VERIFIED_DAYS = 1      # 🟢 Updated today
FRESHNESS_RECENT_DAYS = 2        # 🟡 Updated 1–2 days ago
FRESHNESS_STALE_DAYS = 7         # 🟠 Older data
# Beyond FRESHNESS_STALE_DAYS    # 🔴 No verified recent data

FRESHNESS_LABELS = {
    "verified": "🟢 Updated today",
    "recent": "🟡 Updated 1–2 days ago",
    "stale": "🟠 Older data",
    "unavailable": "🔴 No verified recent data",
}

# ---------------------------------------------------------------------------
# Trend thresholds (percentage)
# ---------------------------------------------------------------------------
TREND_STRONGLY_RISING = 8.0
TREND_RISING = 2.0
TREND_STABLE_UPPER = 2.0
TREND_STABLE_LOWER = -2.0
TREND_FALLING = -2.0
TREND_STRONGLY_FALLING = -8.0

TREND_LABELS = {
    "strongly_rising": "Strongly rising ↑↑",
    "rising": "Rising ↑",
    "stable": "Stable →",
    "falling": "Falling ↓",
    "strongly_falling": "Strongly falling ↓↓",
}

# ---------------------------------------------------------------------------
# Confidence labels
# ---------------------------------------------------------------------------
CONFIDENCE_HIGH = "high"
CONFIDENCE_MEDIUM = "medium"
CONFIDENCE_LOW = "low"

# ---------------------------------------------------------------------------
# Data quality statuses
# ---------------------------------------------------------------------------
DQ_VALIDATED = "validated"
DQ_FLAGGED = "flagged"
DQ_REJECTED = "rejected"
DQ_PENDING = "pending"

# ---------------------------------------------------------------------------
# Default price unit
# ---------------------------------------------------------------------------
DEFAULT_PRICE_UNIT = "INR/quintal"
DEFAULT_QUANTITY_UNIT = "quintal"

# ---------------------------------------------------------------------------
# Forecast horizons
# ---------------------------------------------------------------------------
FORECAST_HORIZONS = [1, 3, 7]

# ---------------------------------------------------------------------------
# Supported districts (initial 5)
# ---------------------------------------------------------------------------
INITIAL_DISTRICTS = [
    {"name": "Nizamabad", "slug": "nizamabad"},
    {"name": "Karimnagar", "slug": "karimnagar"},
    {"name": "Warangal", "slug": "warangal"},
    {"name": "Nalgonda", "slug": "nalgonda"},
    {"name": "Khammam", "slug": "khammam"},
]

# ---------------------------------------------------------------------------
# Chatbot rate limits
# ---------------------------------------------------------------------------
CHATBOT_RATE_LIMIT_ANONYMOUS = 10   # requests/day/IP
CHATBOT_RATE_LIMIT_USER = 30        # requests/day/user
