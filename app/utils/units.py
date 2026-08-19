"""Unit conversions and normalization utilities."""

UNIT_CONVERSIONS = {
    ("kg", "quintal"): 0.01,
    ("quintal", "kg"): 100.0,
    ("tonne", "quintal"): 10.0,
    ("quintal", "tonne"): 0.1,
}

def normalize_price_to_quintal(price: float, unit: str) -> float:
    """Normalizes price to per quintal."""
    unit_lower = unit.lower().strip()
    if "kg" in unit_lower and "quintal" not in unit_lower:
        return round(price * 100.0, 2)
    if "tonne" in unit_lower or "ton" in unit_lower:
        return round(price / 10.0, 2)
    return round(price, 2)
