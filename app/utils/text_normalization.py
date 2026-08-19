"""Text normalization and multilingual keyword mapping."""

DISTRICT_MAP = {
    "nizamabad": "nizamabad",
    "నిజామాబాద్": "nizamabad",
    "karimnagar": "karimnagar",
    "కరీంనగర్": "karimnagar",
    "warangal": "warangal",
    "వరంగల్": "warangal",
    "nalgonda": "nalgonda",
    "నల్గొండ": "nalgonda",
    "khammam": "khammam",
    "ఖమ్మం": "khammam",
}

COMMODITY_MAP = {
    "tomato": "tomato",
    "tomatoes": "tomato",
    "టమాటా": "tomato",
    "టమోటా": "tomato",
    "cotton": "cotton",
    "పత్తి": "cotton",
    "turmeric": "turmeric",
    "పసుపు": "turmeric",
    "paddy": "paddy",
    "rice": "paddy",
    "వరి": "paddy",
    "ధాన్యం": "paddy",
    "maize": "maize",
    "corn": "maize",
    "మొక్కజొన్న": "maize",
    "chilli": "red_chilli",
    "red chilli": "red_chilli",
    "మిరప": "red_chilli",
    "onion": "onion",
    "ఉల్లిపాయ": "onion",
    "groundnut": "groundnut",
    "వేరుశనగ": "groundnut",
}

def extract_district(text: str) -> str | None:
    text_lower = text.lower()
    for key, slug in DISTRICT_MAP.items():
        if key in text_lower:
            return slug
    return None

def extract_commodity(text: str) -> str | None:
    text_lower = text.lower()
    for key, cid in COMMODITY_MAP.items():
        if key in text_lower:
            return cid
    return None
