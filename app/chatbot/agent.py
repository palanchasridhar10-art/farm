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
        categories = {}
        for c in commodities:
            cat = c.get("category", "General")
            categories.setdefault(cat, []).append(c["canonical_name"] + (f" ({c['local_name_te']})" if c.get("local_name_te") and lang.startswith("te") else ""))
        
        if lang.startswith("te"):
            lines = [f"🌾 అందుబాటులో ఉన్న పంటలు మొత్తం ({len(commodities)} రకాలు):"]
            for cat, items in categories.items():
                lines.append(f"\n📂 {cat}:\n  " + ", ".join(items))
            answer = "\n".join(lines)
        else:
            lines = [f"🌾 All Supported Crops & Commodities ({len(commodities)} total):"]
            for cat, items in categories.items():
                lines.append(f"\n📂 {cat}:\n  " + ", ".join(items))
            answer = "\n".join(lines)
        return {"answer": answer, "tools_used": ["list_supported_commodities"], "language": lang}

    if intent == "LIST_DISTRICTS":
        districts = tool_list_supported_districts(db)
        answer = "Supported districts (33): " + ", ".join(districts) if lang == "en" else "అందుబాటులో ఉన్న 33 జిల్లాలు: " + ", ".join(districts)
        return {"answer": answer, "tools_used": ["list_supported_districts"], "language": lang}

    if not commodity:
        commodities = tool_list_supported_commodities(db)
        sample_crops = ["Tomato", "Cotton", "Turmeric", "Paddy / Rice", "Red Chilli", "Onion", "Groundnut", "Bengal Gram", "Green Gram", "Mango", "Potato", "Soybean", "Maize"]
        if lang.startswith("te"):
            answer = (f"దయచేసి పంట పేరు చెప్పండి. ఉదాహరణకు:\n"
                      f"• 'నల్గొండలో టమాటా ధర ఎంత?'\n"
                      f"• 'పత్తి 7 రోజుల అంచనా'\n"
                      f"• 'వరి మార్కెట్ పోలిక'\n"
                      f"• 'మిర్చికి ఉత్తమ మార్కెట్ ఏది?'\n\n"
                      f"🌾 అందుబాటులో ఉన్న పంటలు ({len(commodities)} రకాలు): " + ", ".join(sample_crops) + ", ...\n"
                      f"(అన్ని పంటల జాబితా కోసం 'crops' అని టైప్ చేయండి)")
        else:
            answer = (f"Please specify a crop or commodity. For example:\n"
                      f"• 'Tomato price in Nalgonda'\n"
                      f"• 'Cotton 7-day forecast'\n"
                      f"• 'Compare Turmeric markets'\n"
                      f"• 'Best market for Paddy'\n"
                      f"• 'Red Chilli price in Khammam'\n\n"
                      f"🌾 Supported crops ({len(commodities)} total): " + ", ".join(sample_crops) + ", ...\n"
                      f"(Type 'crops' to view all {len(commodities)} commodities by category)")
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
        answer = "నేను మార్కెట్ ధరలు, అంచనాలు మరియు పోలికలు అందించగలను. ఉదా: 'టమాటా ధర ఎంత?', 'పత్తి అంచనా', 'మిరప మార్కెట్లు పోల్చండి'."
    else:
        answer = "I can help with market prices, 7-day forecasts, and district comparisons for all crops. Try: 'Tomato price in Nalgonda' or 'Compare Cotton markets'."
    return {"answer": answer, "tools_used": [], "language": lang}
