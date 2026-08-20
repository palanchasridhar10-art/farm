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
# Supported districts (All 33 districts of Telangana)
# ---------------------------------------------------------------------------
INITIAL_DISTRICTS = [
    {"name": "Adilabad", "slug": "adilabad"},
    {"name": "Bhadradri Kothagudem", "slug": "bhadradri-kothagudem"},
    {"name": "Hanamkonda", "slug": "hanamkonda"},
    {"name": "Hyderabad", "slug": "hyderabad"},
    {"name": "Jagtial", "slug": "jagtial"},
    {"name": "Jangaon", "slug": "jangaon"},
    {"name": "Jayashankar Bhupalpally", "slug": "jayashankar-bhupalpally"},
    {"name": "Jogulamba Gadwal", "slug": "jogulamba-gadwal"},
    {"name": "Kamareddy", "slug": "kamareddy"},
    {"name": "Karimnagar", "slug": "karimnagar"},
    {"name": "Khammam", "slug": "khammam"},
    {"name": "Komaram Bheem Asifabad", "slug": "komaram-bheem-asifabad"},
    {"name": "Mahabubabad", "slug": "mahabubabad"},
    {"name": "Mahabubnagar", "slug": "mahabubnagar"},
    {"name": "Mancherial", "slug": "mancherial"},
    {"name": "Medak", "slug": "medak"},
    {"name": "Medchal-Malkajgiri", "slug": "medchal-malkajgiri"},
    {"name": "Mulugu", "slug": "mulugu"},
    {"name": "Nagarkurnool", "slug": "nagarkurnool"},
    {"name": "Nalgonda", "slug": "nalgonda"},
    {"name": "Narayanpet", "slug": "narayanpet"},
    {"name": "Nirmal", "slug": "nirmal"},
    {"name": "Nizamabad", "slug": "nizamabad"},
    {"name": "Peddapalli", "slug": "peddapalli"},
    {"name": "Rajanna Sircilla", "slug": "rajanna-sircilla"},
    {"name": "Rangareddy", "slug": "rangareddy"},
    {"name": "Sangareddy", "slug": "sangareddy"},
    {"name": "Siddipet", "slug": "siddipet"},
    {"name": "Suryapet", "slug": "suryapet"},
    {"name": "Vikarabad", "slug": "vikarabad"},
    {"name": "Wanaparthy", "slug": "wanaparthy"},
    {"name": "Warangal", "slug": "warangal"},
    {"name": "Yadadri Bhuvanagiri", "slug": "yadadri-bhuvanagiri"},
]

# ---------------------------------------------------------------------------
# Chatbot rate limits
# ---------------------------------------------------------------------------
CHATBOT_RATE_LIMIT_ANONYMOUS = 10   # requests/day/IP
CHATBOT_RATE_LIMIT_USER = 30        # requests/day/user
