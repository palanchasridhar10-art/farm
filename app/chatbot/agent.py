"""Chatbot agent — orchestrates intent detection, tool calls, and response formatting."""

from sqlalchemy.orm import Session
from app.chatbot.router import parse_user_message
from app.chatbot.tools import (
    tool_get_current_price, tool_get_forecast, tool_compare_markets,
    tool_find_best_market, tool_list_supported_commodities, tool_list_supported_districts,
)
from app.chatbot.prompts import format_price_response, format_forecast_response, format_comparison_response


def handle_chat(db: Session, message: str, language: str = "en") -> dict:
    parsed = parse_user_message(message)
    lang = parsed["language"] or language
    intent = parsed["intent"]
    commodity = parsed["commodity"]
    district = parsed["district"]

    if intent == "LIST_COMMODITIES":
        commodities = tool_list_supported_commodities(db)
        names = [c["canonical_name"] for c in commodities]
        answer = "Supported crops: " + ", ".join(names) if lang == "en" else "అందుబాటులో ఉన్న పంటలు: " + ", ".join(names)
        return {"answer": answer, "tools_used": ["list_supported_commodities"], "language": lang}

    if intent == "LIST_DISTRICTS":
        districts = tool_list_supported_districts(db)
        answer = "Supported districts: " + ", ".join(districts) if lang == "en" else "అందుబాటులో ఉన్న జిల్లాలు: " + ", ".join(districts)
        return {"answer": answer, "tools_used": ["list_supported_districts"], "language": lang}

    if not commodity:
        commodities = tool_list_supported_commodities(db)
        names = [c["canonical_name"] for c in commodities[:10]]
        if lang.startswith("te"):
            answer = "దయచేసి పంట పేరు చెప్పండి. ఉదా: టమాటా ధర నల్గొండలో ఎంత?\nఅందుబాటులో: " + ", ".join(names)
        else:
            answer = "Please specify a crop. Try: 'tomato price in Nalgonda' or 'cotton forecast'\nSupported: " + ", ".join(names)
        return {"answer": answer, "tools_used": [], "language": lang}

    if intent == "PRICE_FORECAST":
        res = tool_get_forecast(db, commodity, district or "nalgonda")
        answer = format_forecast_response(res, lang)
        return {"answer": answer, "tools_used": ["get_forecast"], "result": res, "language": lang}

    if intent == "COMPARE_MARKETS":
        res = tool_compare_markets(db, commodity)
        answer = format_comparison_response(res, lang)
        return {"answer": answer, "tools_used": ["compare_markets"], "result": res, "language": lang}

    if intent == "BEST_MARKET":
        res = tool_find_best_market(db, commodity)
        if "error" in res:
            return {"answer": res["error"], "tools_used": ["find_best_market"], "language": lang}
        rankings = res.get("rankings", [])
        if lang.startswith("te"):
            lines = [f"🏆 {res['commodity']} కి ఉత్తమ మార్కెట్లు:\n"]
            for r in rankings[:5]:
                lines.append(f"• {r['district']}: ₹{r['current_price']:,.2f} (స్కోరు: {r['opportunity_score']})")
        else:
            lines = [f"🏆 Best markets for {res['commodity']}:\n"]
            for r in rankings[:5]:
                lines.append(f"• {r['district']}: ₹{r['current_price']:,.2f} (Score: {r['opportunity_score']})")
        return {"answer": "\n".join(lines), "tools_used": ["find_best_market"], "result": res, "language": lang}

    if intent in ("CURRENT_PRICE", "TREND"):
        res = tool_get_current_price(db, commodity, district)
        answer = format_price_response(res, lang)
        return {"answer": answer, "tools_used": ["get_current_price"], "result": res, "language": lang}

    if lang.startswith("te"):
        answer = "నేను మార్కెట్ ధరలు, అంచనాలు మరియు పోలికలు అందించగలను. ఉదా: 'టమాటా ధర నల్గొండలో ఎంత?'"
    else:
        answer = "I can help with market prices, forecasts, and comparisons. Try: 'tomato price in Nalgonda' or 'compare cotton markets'"
    return {"answer": answer, "tools_used": [], "language": lang}
