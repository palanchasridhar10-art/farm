"""System prompts and multilingual response formatters for the AI Chatbot."""

SYSTEM_PROMPT = """You are Farmer Market AI, an intelligent agricultural market-price assistant for Telangana farmers.
Your primary responsibility is to explain verified market observations and machine-learning price forecasts clearly.

RULES:
1. Never invent a market price, forecast, date, market, district, or source.
2. Ground all answers strictly in the structured tool results provided to you.
3. Clearly distinguish CURRENT VERIFIED PRICE from MACHINE-LEARNING PREDICTED PRICE.
4. Never present a forecast as a guaranteed future price.
5. If the user asks in Telugu, respond in helpful Telugu. If in English, respond in English.
6. Provide concise, farmer-friendly answers with ₹/quintal pricing and dates.
7. Warn that transport, quality, and mandi arrival timing affect actual net realization.
"""

def format_price_response(res: dict, lang: str = "en") -> str:
    if "error" in res:
        return res["error"]
    data = res["data"]
    meta = res["meta"]
    if lang.startswith("te"):
        return (f"🌾 {data.get('commodity_te') or data['commodity']} — {data['district']}\n"
                f"📅 తేదీ: {meta['observation_date']} ({meta['freshness_label']})\n"
                f"💰 మోడల్ ధర: ₹{data['modal_price']:,.2f}/క్వింటాల్\n"
                f"📊 పరిధి: ₹{data['min_price']:,.2f}–₹{data['max_price']:,.2f}\n"
                f"📈 7-రోజుల ధోరణి: {data['trend_label']} ({data['trend_7d_pct']:+.1f}%)")
    return (f"🌾 {data['commodity']} — {data['district']} ({data['market']})\n"
            f"📅 Date: {meta['observation_date']} ({meta['freshness_label']})\n"
            f"💰 Modal Price: ₹{data['modal_price']:,.2f}/quintal\n"
            f"📊 Range: ₹{data['min_price']:,.2f}–₹{data['max_price']:,.2f}\n"
            f"📈 7-Day Trend: {data['trend_label']} ({data['trend_7d_pct']:+.1f}%)")

def format_forecast_response(res: dict, lang: str = "en") -> str:
    if "error" in res:
        return res["error"]
    f_items = res.get("forecasts", [])
    if not f_items:
        return "No forecast available."
    if lang.startswith("te"):
        lines = [f"📈 {res.get('commodity_te') or res['commodity']} అంచనా — {res['district']}\n"]
        for f in f_items:
            lines.append(f"• {f['horizon_days']} రోజుల్లో: ~₹{f['predicted_price']:,.2f} (₹{f['lower_bound']:,.2f}–₹{f['upper_bound']:,.2f})")
        lines.append(f"\n⚠️ {res['disclaimer']}")
        return "\n".join(lines)
    lines = [f"📈 Forecast: {res['commodity']} — {res['district']}\n"]
    for f in f_items:
        lines.append(f"• Next {f['horizon_days']}d: ~₹{f['predicted_price']:,.2f} (₹{f['lower_bound']:,.2f}–₹{f['upper_bound']:,.2f})")
    lines.append(f"\n⚠️ {res['disclaimer']}")
    return "\n".join(lines)

def format_comparison_response(res: dict, lang: str = "en") -> str:
    if "error" in res:
        return res["error"]
    comps = res.get("comparisons", [])
    if not comps:
        return "No comparison data available."
    lines = [f"📊 {res['commodity']} — District Comparison:\n"]
    for c in comps:
        lines.append(f"{c['rank']}. {c['district']}: ₹{c['current_modal_price']:,.2f} | 7d forecast: ₹{c['forecast_7d']:,.2f}")
    best = res.get("best_current_market")
    if best:
        lines.append(f"\n🏆 Highest: {best['district']} at ₹{best['current_modal_price']:,.2f}/q")
    return "\n".join(lines)
