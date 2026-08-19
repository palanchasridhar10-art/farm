"""Rule-based intent router for the chatbot — works without an LLM."""

from app.utils.text_normalization import extract_commodity, extract_district

INTENT_KEYWORDS = {
    "PRICE_FORECAST": ["forecast", "predict", "next", "రేపు", "అంచనా", "పెరుగ", "week", "tomorrow"],
    "COMPARE_MARKETS": ["compare", "comparison", "best market", "పోల్చ", "ఏ మార్కెట్"],
    "BEST_MARKET": ["best", "highest", "top", "మంచి ధర", "అత్యధిక"],
    "TREND": ["trend", "rising", "falling", "up", "down", "ధోరణి", "పెరుగుతో", "తగ్గుతో"],
    "CURRENT_PRICE": ["price", "rate", "cost", "ధర", "ఎంత", "రేటు"],
    "LIST_COMMODITIES": ["crops", "commodities", "supported", "what can", "list", "పంటలు"],
    "LIST_DISTRICTS": ["districts", "areas", "జిల్లాలు"],
    "HELP": ["help", "సహాయం", "how"],
}

def detect_intent(text: str) -> str:
    text_lower = text.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return intent
    return "HELP"

def detect_language(text: str) -> str:
    for ch in text:
        if "\u0C00" <= ch <= "\u0C7F":
            return "te"
    return "en"

def parse_user_message(text: str) -> dict:
    return {
        "intent": detect_intent(text),
        "commodity": extract_commodity(text),
        "district": extract_district(text),
        "language": detect_language(text),
        "raw": text,
    }
