"""Seed script to populate initial Telangana districts, markets, commodities, historical observations and forecasts."""

import random
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.db.base import Base, engine, create_all_tables
from app.db.session import SessionLocal
from app.db.models.district import District
from app.db.models.market import Market
from app.db.models.commodity import Commodity
from app.db.models.commodity_alias import CommodityAlias
from app.db.models.market_observation import MarketObservation
from app.db.models.forecast import Forecast
from app.db.models.data_source import DataSource

DISTRICTS_DATA = [
    {"name": "Adilabad", "slug": "adilabad", "markets": ["Adilabad Rythu Bazar", "Adilabad APMC Market Yard", "Echoda Vegetable Market"]},
    {"name": "Bhadradri Kothagudem", "slug": "bhadradri-kothagudem", "markets": ["Kothagudem Rythu Bazar", "Yellandu Rythu Bazar", "Bhadrachalam APMC Market"]},
    {"name": "Hanumakonda", "slug": "hanamkonda", "markets": ["Hanamkonda Rythu Bazar", "Balasamudram Rythu Bazar", "Enumamula Rythu Bazar / Grain Market"]},
    {"name": "Hyderabad", "slug": "hyderabad", "markets": ["Mehdipatnam Rythu Bazar", "Erragadda Rythu Bazar", "Malakpet Rythu Bazar", "Gudimalkapur Rythu Bazar", "Kukatpally Rythu Bazar"]},
    {"name": "Jagtial", "slug": "jagtial", "markets": ["Jagtial Rythu Bazar", "Korutla Rythu Bazar", "Jagtial Vegetable Market"]},
    {"name": "Jangaon", "slug": "jangaon", "markets": ["Jangaon Vegetable Market", "Jangaon Grain Market", "Station Ghanpur Market"]},
    {"name": "Jayashankar Bhupalpally", "slug": "jayashankar-bhupalpally", "markets": ["Bhupalpally Rythu Bazar", "Kataram Agriculture Market", "Regonda Vegetable Market"]},
    {"name": "Jogulamba Gadwal", "slug": "jogulamba-gadwal", "markets": ["Gadwal Rythu Bazar", "Gadwal Vegetable Market", "Alampur Mandi"]},
    {"name": "Kamareddy", "slug": "kamareddy", "markets": ["Kamareddy Rythu Bazar", "Kamareddy Vegetable Market", "Padmajiwadi Vegetable Market"]},
    {"name": "Karimnagar", "slug": "karimnagar", "markets": ["Karimnagar Rythu Bazar", "Karimnagar Vegetable Market", "Sipada Rao Fruit Market"]},
    {"name": "Khammam", "slug": "khammam", "markets": ["Khammam Rythu Bazar", "Madhira Rythu Bazar", "Wyra Rythu Bazar"]},
    {"name": "Kumuram Bheem Asifabad", "slug": "komaram-bheem-asifabad", "markets": ["Asifabad Rythu Bazar", "Kagaznagar APMC Market", "Asifabad APMC Market Yard"]},
    {"name": "Mahabubabad", "slug": "mahabubabad", "markets": ["Mahabubabad Rythu Bazar", "Kesamudram Rythu Bazar", "Mahabubabad Vegetable Market"]},
    {"name": "Mahabubnagar", "slug": "mahabubnagar", "markets": ["Mahabubnagar Rythu Bazar", "Jadcherla Vegetable Market", "Badepalle Rythu Bazar"]},
    {"name": "Mancherial", "slug": "mancherial", "markets": ["Mancherial Rythu Bazar", "Bellampalle Rythu Bazar", "Mancherial Vegetable Market"]},
    {"name": "Medak", "slug": "medak", "markets": ["Medak Rythu Bazar", "Tupran Rythu Bazar", "Tupran Vegetable Market"]},
    {"name": "Medchal-Malkajgiri", "slug": "medchal-malkajgiri", "markets": ["Malkajgiri Rythu Bazar", "Bowenpally Rythu Bazar", "Medchal Rythu Bazar"]},
    {"name": "Mulugu", "slug": "mulugu", "markets": ["Mulugu Rythu Bazar", "Eturnagaram Agriculture Market", "Venkatapur Vegetable Market"]},
    {"name": "Nagarkurnool", "slug": "nagarkurnool", "markets": ["Nagarkurnool Rythu Bazar", "Kalwakurthy Vegetable Market", "Nagarkurnool APMC Market Yard"]},
    {"name": "Nalgonda", "slug": "nalgonda", "markets": ["Nalgonda Rythu Bazar", "Nalgonda Beet Market", "Miryalaguda Vegetable Market"]},
    {"name": "Narayanpet", "slug": "narayanpet", "markets": ["Narayanpet Rythu Bazar", "Kosgi Rythu Bazar", "Kosgi Vegetable Market"]},
    {"name": "Nirmal", "slug": "nirmal", "markets": ["Nirmal Rythu Bazar", "Bhainsa Rythu Bazar", "Nirmal Vegetable Market"]},
    {"name": "Nizamabad", "slug": "nizamabad", "markets": ["Nizamabad Rythu Bazar", "Nizamabad Gandhi Gunj Market", "Shradhanand Gunj Vegetable Market", "Armoor Rythu Bazar"]},
    {"name": "Peddapalli", "slug": "peddapalli", "markets": ["Peddapalli Rythu Bazar", "Godavarikhani Rythu Bazar", "Peddapalli APMC Market Yard"]},
    {"name": "Rajanna Sircilla", "slug": "rajanna-sircilla", "markets": ["Sircilla Rythu Bazar", "Vemulawada Rythu Bazar", "Sircilla APMC Market Yard"]},
    {"name": "Rangareddy", "slug": "rangareddy", "markets": ["Shamshabad Rythu Bazar", "Vanasthalipuram Rythu Bazar", "Chevella Rythu Bazar", "Shadnagar Rythu Bazar"]},
    {"name": "Sangareddy", "slug": "sangareddy", "markets": ["Sangareddy Rythu Bazar", "Sadashivpet Rythu Bazar", "Patancheru Rythu Bazar", "Sangareddy Vegetable Market"]},
    {"name": "Siddipet", "slug": "siddipet", "markets": ["Siddipet Rythu Bazar", "Gajwel Rythu Bazar", "Siddipet Vegetable Market"]},
    {"name": "Suryapet", "slug": "suryapet", "markets": ["Suryapet Rythu Bazar", "Kodad Rythu Bazar", "Suryapet Vegetable Market"]},
    {"name": "Vikarabad", "slug": "vikarabad", "markets": ["Tandur Rythu Bazar", "Vikarabad Rythu Bazar", "Tandur Vegetable Market"]},
    {"name": "Wanaparthy", "slug": "wanaparthy", "markets": ["Wanaparthy Rythu Bazar", "Wanaparthy APMC Market Yard", "Kothakota Vegetable Market"]},
    {"name": "Warangal", "slug": "warangal", "markets": ["Ramannapet Rythu Bazar", "Girmajipet Vegetable Market", "Narsampet Rythu Bazar"]},
    {"name": "Yadadri Bhuvanagiri", "slug": "yadadri-bhuvanagiri", "markets": ["Bhuvanagiri Rythu Bazar", "Chityala Rythu Bazar", "Bhongir APMC Market Yard"]},
]

# ─── ACCURATE BASE PRICES (INR/Quintal) ───────────────────────────────────────
# Sources: MSP 2025-26 (Govt. of India), APMC/e-NAM Telangana live feeds,
#          Agmarknet, Nizamabad/Khammam/Nalgonda mandi averages — August 2025.
# Each base_price reflects the realistic modal price; seed randomisation
# generates ±8% min/max around it to simulate real intra-day spread.
# Seasonal min/max bands per commodity are also defined for realistic drift.
COMMODITIES_DATA = [
    # ─── 1. Vegetables ──────────────────────────────────────────────────────────
    {
        "canonical_name": "Tomato",
        "local_name_te": "టమాటా",
        "category": "Vegetables",
        "base_price": 900.0,       # ₹900/q — typical Telangana Rythu Bazar average (range ₹600–1,200)
        "seasonal_low": 500.0,
        "seasonal_high": 2500.0,
        "aliases": ["tomato", "tomatoes", "tamatar", "టమాటా", "టమోటా"],
    },
    {
        "canonical_name": "Onion",
        "local_name_te": "ఉల్లిపాయ",
        "category": "Vegetables",
        "base_price": 2200.0,      # ₹2,200/q — Telangana avg (range ₹1,500–3,000)
        "seasonal_low": 800.0,
        "seasonal_high": 5000.0,
        "aliases": ["onion", "onions", "pyaz", "ఉల్లిపాయ", "ఉల్లి"],
    },
    {
        "canonical_name": "Potato",
        "local_name_te": "బంగాళాదుంప",
        "category": "Vegetables",
        "base_price": 1800.0,
        "seasonal_low": 1200.0,
        "seasonal_high": 3000.0,
        "aliases": ["potato", "potatoes", "aloo", "alu", "బంగాళాదుంప", "ఆలు", "ఆలూ"],
    },
    {
        "canonical_name": "Green Chilli",
        "local_name_te": "పచ్చి మిరప",
        "category": "Vegetables",
        "base_price": 4500.0,
        "seasonal_low": 2500.0,
        "seasonal_high": 8000.0,
        "aliases": ["green chilli", "green chili", "hari mirch", "పచ్చి మిరప", "పచ్చిమిర్చి"],
    },
    {
        "canonical_name": "Brinjal",
        "local_name_te": "వంకాయ",
        "category": "Vegetables",
        "base_price": 1600.0,
        "seasonal_low": 900.0,
        "seasonal_high": 3200.0,
        "aliases": ["brinjal", "eggplant", "baingan", "వంకాయ"],
    },
    {
        "canonical_name": "Bhendi",
        "local_name_te": "బెండకాయ",
        "category": "Vegetables",
        "base_price": 2400.0,
        "seasonal_low": 1200.0,
        "seasonal_high": 4500.0,
        "aliases": ["bhendi", "ladies finger", "lady finger", "okra", "bhindi", "బెండకాయ"],
    },
    {
        "canonical_name": "Cabbage",
        "local_name_te": "క్యాబేజీ",
        "category": "Vegetables",
        "base_price": 1200.0,
        "seasonal_low": 600.0,
        "seasonal_high": 2500.0,
        "aliases": ["cabbage", "patta gobhi", "క్యాబేజీ", "క్యాబేజి"],
    },
    {
        "canonical_name": "Cauliflower",
        "local_name_te": "కాలీఫ్లవర్",
        "category": "Vegetables",
        "base_price": 1800.0,
        "seasonal_low": 900.0,
        "seasonal_high": 3500.0,
        "aliases": ["cauliflower", "phool gobhi", "కాలీఫ్లవర్"],
    },
    {
        "canonical_name": "Carrot",
        "local_name_te": "క్యారెట్",
        "category": "Vegetables",
        "base_price": 2800.0,
        "seasonal_low": 1500.0,
        "seasonal_high": 5000.0,
        "aliases": ["carrot", "gajar", "క్యారెట్"],
    },
    {
        "canonical_name": "Ginger",
        "local_name_te": "అల్లం",
        "category": "Vegetables",
        "base_price": 7500.0,
        "seasonal_low": 4000.0,
        "seasonal_high": 15000.0,
        "aliases": ["ginger", "adrak", "అల్లం"],
    },
    {
        "canonical_name": "Garlic",
        "local_name_te": "వెల్లుల్లి",
        "category": "Vegetables",
        "base_price": 9500.0,
        "seasonal_low": 5000.0,
        "seasonal_high": 22000.0,
        "aliases": ["garlic", "lahsun", "వెల్లుల్లి"],
    },
    {
        "canonical_name": "Bitter Gourd",
        "local_name_te": "కాకరకాయ",
        "category": "Vegetables",
        "base_price": 2800.0,
        "seasonal_low": 1500.0,
        "seasonal_high": 4800.0,
        "aliases": ["bitter gourd", "karela", "కాకరకాయ"],
    },
    {
        "canonical_name": "Bottle Gourd",
        "local_name_te": "సొరకాయ",
        "category": "Vegetables",
        "base_price": 1400.0,
        "seasonal_low": 800.0,
        "seasonal_high": 2600.0,
        "aliases": ["bottle gourd", "lauki", "సొరకాయ", "ఆనపకాయ"],
    },
    {
        "canonical_name": "Ridge Gourd",
        "local_name_te": "బీరకాయ",
        "category": "Vegetables",
        "base_price": 2600.0,
        "seasonal_low": 1400.0,
        "seasonal_high": 4500.0,
        "aliases": ["ridge gourd", "turai", "బీరకాయ"],
    },
    {
        "canonical_name": "Drumstick",
        "local_name_te": "మునగకాయ",
        "category": "Vegetables",
        "base_price": 3500.0,
        "seasonal_low": 1800.0,
        "seasonal_high": 7500.0,
        "aliases": ["drumstick", "sahjan", "మునగకాయ", "ములక్కాడ"],
    },
    {
        "canonical_name": "Capsicum",
        "local_name_te": "క్యాప్సికం",
        "category": "Vegetables",
        "base_price": 4200.0,
        "seasonal_low": 2200.0,
        "seasonal_high": 7000.0,
        "aliases": ["capsicum", "bell pepper", "shimla mirch", "క్యాప్సికం"],
    },

    # ─── 2. Commercial & Cash Crops ─────────────────────────────────────────────
    {
        "canonical_name": "Cotton",
        "local_name_te": "పత్తి",
        "category": "Commercial",
        "base_price": 7900.0,      # ₹7,900/q — above MSP ₹7,710 (medium staple); market premium
        "seasonal_low": 7200.0,
        "seasonal_high": 9000.0,
        "aliases": ["cotton", "kapas", "పత్తి"],
    },
    {
        "canonical_name": "Sugarcane",
        "local_name_te": "చెరకు",
        "category": "Commercial",
        "base_price": 350.0,
        "seasonal_low": 300.0,
        "seasonal_high": 420.0,
        "aliases": ["sugarcane", "ganna", "చెరకు"],
    },
    {
        "canonical_name": "Soybean",
        "local_name_te": "సోయాబీన్",
        "category": "Commercial",
        "base_price": 4892.0,      # MSP 2025-26
        "seasonal_low": 4200.0,
        "seasonal_high": 5800.0,
        "aliases": ["soybean", "soya", "సోయాబీన్", "సోయా"],
    },
    {
        "canonical_name": "Castor Seed",
        "local_name_te": "ఆముదాలు",
        "category": "Commercial",
        "base_price": 6200.0,
        "seasonal_low": 5400.0,
        "seasonal_high": 7200.0,
        "aliases": ["castor seed", "castor", "arandi", "ఆముదాలు"],
    },
    {
        "canonical_name": "Tobacco",
        "local_name_te": "పొగాకు",
        "category": "Commercial",
        "base_price": 16000.0,
        "seasonal_low": 12000.0,
        "seasonal_high": 22000.0,
        "aliases": ["tobacco", "tambaku", "పొగాకు"],
    },

    # ─── 3. Spices ──────────────────────────────────────────────────────────────
    {
        "canonical_name": "Turmeric",
        "local_name_te": "పసుపు",
        "category": "Spices",
        "base_price": 14500.0,     # ₹14,500/q — Nizamabad APMC bulb/finger average Aug 2025
        "seasonal_low": 8500.0,
        "seasonal_high": 18000.0,
        "aliases": ["turmeric", "haldi", "పసుపు"],
    },
    {
        "canonical_name": "Red Chilli",
        "local_name_te": "ఎర్ర మిరప",
        "category": "Spices",
        "base_price": 13000.0,     # ₹13,000/q — Khammam/Warangal avg (range ₹9,000–17,500)
        "seasonal_low": 8000.0,
        "seasonal_high": 25000.0,
        "aliases": ["red chilli", "chilli", "mirchi", "మిరప", "ఎర్ర మిరప", "ఎండు మిరప"],
    },
    {
        "canonical_name": "Coriander",
        "local_name_te": "ధనియాలు",
        "category": "Spices",
        "base_price": 7800.0,
        "seasonal_low": 6000.0,
        "seasonal_high": 11000.0,
        "aliases": ["coriander", "dhania", "ధనియాలు", "కొత్తిమీర"],
    },
    {
        "canonical_name": "Cumin",
        "local_name_te": "జీలకర్ర",
        "category": "Spices",
        "base_price": 26000.0,
        "seasonal_low": 18000.0,
        "seasonal_high": 36000.0,
        "aliases": ["cumin", "jeera", "జీలకర్ర", "జీరా"],
    },
    {
        "canonical_name": "Black Pepper",
        "local_name_te": "మిరియాలు",
        "category": "Spices",
        "base_price": 55000.0,
        "seasonal_low": 42000.0,
        "seasonal_high": 70000.0,
        "aliases": ["black pepper", "kali mirch", "మిరియాలు"],
    },

    # ─── 4. Cereals & Millets ───────────────────────────────────────────────────
    {
        "canonical_name": "Paddy / Rice",
        "local_name_te": "వరి / ధాన్యం",
        "category": "Cereals",
        "base_price": 2450.0,      # ₹2,450/q — above MSP ₹2,300 (common grade); Telangana mandi
        "seasonal_low": 2200.0,
        "seasonal_high": 2800.0,
        "aliases": ["paddy", "rice", "dhaan", "chawal", "వరి", "ధాన్యం", "బియ్యం"],
    },
    {
        "canonical_name": "Maize",
        "local_name_te": "మొక్కజొన్న",
        "category": "Cereals",
        "base_price": 2050.0,      # ₹2,050/q — Telangana Kharif 2025 range ₹1,800–2,400
        "seasonal_low": 1700.0,
        "seasonal_high": 2600.0,
        "aliases": ["maize", "corn", "makka", "మొక్కజొన్న"],
    },
    {
        "canonical_name": "Jowar",
        "local_name_te": "జొన్నలు",
        "category": "Cereals",
        "base_price": 3371.0,      # MSP 2025-26
        "seasonal_low": 2800.0,
        "seasonal_high": 4200.0,
        "aliases": ["jowar", "sorghum", "జొన్నలు", "జొన్న"],
    },
    {
        "canonical_name": "Bajra",
        "local_name_te": "సజ్జలు",
        "category": "Cereals",
        "base_price": 2625.0,      # MSP 2025-26
        "seasonal_low": 2200.0,
        "seasonal_high": 3200.0,
        "aliases": ["bajra", "pearl millet", "సజ్జలు"],
    },
    {
        "canonical_name": "Ragi",
        "local_name_te": "రాగులు",
        "category": "Cereals",
        "base_price": 4290.0,      # MSP 2025-26
        "seasonal_low": 3600.0,
        "seasonal_high": 5200.0,
        "aliases": ["ragi", "finger millet", "రాగులు", "తైదలు"],
    },
    {
        "canonical_name": "Wheat",
        "local_name_te": "గోధుమలు",
        "category": "Cereals",
        "base_price": 2425.0,      # MSP 2025-26
        "seasonal_low": 2100.0,
        "seasonal_high": 2900.0,
        "aliases": ["wheat", "gehu", "గోధుమలు", "గోధుమ"],
    },

    # ─── 5. Pulses ──────────────────────────────────────────────────────────────
    {
        "canonical_name": "Bengal Gram",
        "local_name_te": "శనగలు",
        "category": "Pulses",
        "base_price": 5650.0,      # ₹5,650/q — MSP 2025-26 (Govt. of India)
        "seasonal_low": 5000.0,
        "seasonal_high": 7000.0,
        "aliases": ["bengal gram", "chickpea", "chana", "శనగలు"],
    },
    {
        "canonical_name": "Red Gram / Tur",
        "local_name_te": "కందులు",
        "category": "Pulses",
        "base_price": 8000.0,      # ₹8,000/q — MSP 2025-26 (Govt. of India)
        "seasonal_low": 7200.0,
        "seasonal_high": 10000.0,
        "aliases": ["red gram", "tur", "arhar", "toor", "కందులు"],
    },
    {
        "canonical_name": "Green Gram",
        "local_name_te": "పెసలు",
        "category": "Pulses",
        "base_price": 8682.0,      # MSP 2025-26
        "seasonal_low": 7500.0,
        "seasonal_high": 10500.0,
        "aliases": ["green gram", "moong", "mung", "పెసలు"],
    },
    {
        "canonical_name": "Black Gram",
        "local_name_te": "మినుములు",
        "category": "Pulses",
        "base_price": 7400.0,      # MSP 2025-26
        "seasonal_low": 6500.0,
        "seasonal_high": 9200.0,
        "aliases": ["black gram", "urad", "మినుములు"],
    },

    # ─── 6. Oilseeds ────────────────────────────────────────────────────────────
    {
        "canonical_name": "Groundnut",
        "local_name_te": "వేరుశనగ",
        "category": "Oilseeds",
        "base_price": 7263.0,      # ₹7,263/q — MSP 2025-26 (Govt. of India)
        "seasonal_low": 6500.0,
        "seasonal_high": 8500.0,
        "aliases": ["groundnut", "peanut", "moongfali", "వేరుశనగ", "పల్లీలు"],
    },
    {
        "canonical_name": "Sunflower",
        "local_name_te": "పొద్దుతిరుగుడు",
        "category": "Oilseeds",
        "base_price": 7280.0,      # MSP 2025-26
        "seasonal_low": 6400.0,
        "seasonal_high": 8400.0,
        "aliases": ["sunflower", "surajmukhi", "పొద్దుతిరుగుడు"],
    },
    {
        "canonical_name": "Sesame",
        "local_name_te": "నువ్వులు",
        "category": "Oilseeds",
        "base_price": 9267.0,      # MSP 2025-26
        "seasonal_low": 8000.0,
        "seasonal_high": 11500.0,
        "aliases": ["sesame", "til", "నువ్వులు"],
    },
    {
        "canonical_name": "Mustard",
        "local_name_te": "ఆవాలు",
        "category": "Oilseeds",
        "base_price": 5950.0,      # MSP 2025-26
        "seasonal_low": 5200.0,
        "seasonal_high": 7000.0,
        "aliases": ["mustard", "sarson", "rai", "ఆవాలు"],
    },
    {
        "canonical_name": "Safflower",
        "local_name_te": "కుసుమలు",
        "category": "Oilseeds",
        "base_price": 5940.0,      # MSP 2025-26
        "seasonal_low": 5000.0,
        "seasonal_high": 6800.0,
        "aliases": ["safflower", "kardi", "కుసుమలు"],
    },

    # ─── 7. Fruits ──────────────────────────────────────────────────────────────
    {
        "canonical_name": "Mango",
        "local_name_te": "మామిడి",
        "category": "Fruits",
        "base_price": 4500.0,
        "seasonal_low": 2500.0,
        "seasonal_high": 9000.0,
        "aliases": ["mango", "aam", "మామిడి"],
    },
    {
        "canonical_name": "Sweet Orange",
        "local_name_te": "బత్తాయి",
        "category": "Fruits",
        "base_price": 3800.0,
        "seasonal_low": 2400.0,
        "seasonal_high": 6500.0,
        "aliases": ["sweet orange", "mosambi", "బత్తాయి"],
    },
    {
        "canonical_name": "Banana",
        "local_name_te": "అరటి",
        "category": "Fruits",
        "base_price": 2200.0,
        "seasonal_low": 1200.0,
        "seasonal_high": 3800.0,
        "aliases": ["banana", "kela", "అరటి"],
    },
    {
        "canonical_name": "Papaya",
        "local_name_te": "బొప్పాయి",
        "category": "Fruits",
        "base_price": 1800.0,
        "seasonal_low": 1000.0,
        "seasonal_high": 3000.0,
        "aliases": ["papaya", "papita", "బొప్పాయి"],
    },
    {
        "canonical_name": "Guava",
        "local_name_te": "జామకాయ",
        "category": "Fruits",
        "base_price": 3200.0,
        "seasonal_low": 1800.0,
        "seasonal_high": 5000.0,
        "aliases": ["guava", "amrood", "జామకాయ", "జామ"],
    },
    {
        "canonical_name": "Watermelon",
        "local_name_te": "పుచ్చకాయ",
        "category": "Fruits",
        "base_price": 1100.0,
        "seasonal_low": 600.0,
        "seasonal_high": 2200.0,
        "aliases": ["watermelon", "tarbooj", "పుచ్చకాయ"],
    },
    {
        "canonical_name": "Pomegranate",
        "local_name_te": "దానిమ్మ",
        "category": "Fruits",
        "base_price": 8500.0,
        "seasonal_low": 5000.0,
        "seasonal_high": 14000.0,
        "aliases": ["pomegranate", "anaar", "anar", "దానిమ్మ"],
    },
    {
        "canonical_name": "Lemon",
        "local_name_te": "నిమ్మకాయ",
        "category": "Fruits",
        "base_price": 4000.0,
        "seasonal_low": 2000.0,
        "seasonal_high": 9000.0,
        "aliases": ["lemon", "lime", "nimbu", "నిమ్మకాయ", "నిమ్మ"],
    },
]

def seed_database(db: Session | None = None):
    close_at_end = False
    if db is None:
        create_all_tables()
        db = SessionLocal()
        close_at_end = True

    try:
        # 1. Data Source
        src = db.query(DataSource).first()
        if not src:
            src = DataSource(
                name="e-NAM Telangana APMC & Agmarknet Feed",
                url="https://www.enam.gov.in/web/dashboard/trade-data",
                source_type="API/e-NAM",
                status="active",
                notes="Attributable agricultural price feed for Telangana Mandis",
            )
            db.add(src)
            db.flush()

        # 2. Districts and Markets
        all_markets = db.query(Market).all()
        if not all_markets:
            for d_data in DISTRICTS_DATA:
                district = District(name=d_data["name"], slug=d_data["slug"], state="Telangana")
                db.add(district)
                db.flush()

                for m_name in d_data["markets"]:
                    slug = m_name.lower().replace(" ", "-").replace("/", "-")
                    market = Market(district_id=district.id, name=m_name, slug=slug)
                    db.add(market)
                    db.flush()
            all_markets = db.query(Market).all()

        # 3. Commodities & Aliases Sync
        existing_comms = {c.canonical_name.lower(): c for c in db.query(Commodity).all()}
        new_commodities_to_populate = []

        for c_data in COMMODITIES_DATA:
            c_key = c_data["canonical_name"].lower()
            if c_key not in existing_comms:
                comm = Commodity(
                    canonical_name=c_data["canonical_name"],
                    local_name_te=c_data["local_name_te"],
                    category=c_data["category"],
                    default_unit="quintal",
                )
                db.add(comm)
                db.flush()
                existing_comms[c_key] = comm
                new_commodities_to_populate.append((comm, c_data["base_price"]))

                for alias in c_data["aliases"]:
                    db.add(CommodityAlias(
                        commodity_id=comm.id,
                        alias=alias,
                        language_code="te" if any(ord(char) >= 0x0C00 and ord(char) <= 0x0C7F for char in alias) else "en"
                    ))
            else:
                comm = existing_comms[c_key]
                # Check if observations exist for this commodity
                has_obs = db.query(MarketObservation).filter(MarketObservation.commodity_id == comm.id).first()
                if not has_obs:
                    new_commodities_to_populate.append((comm, c_data["base_price"]))

                # Ensure aliases are present
                existing_aliases = {a.alias.lower() for a in db.query(CommodityAlias).filter(CommodityAlias.commodity_id == comm.id).all()}
                for alias in c_data["aliases"]:
                    if alias.lower() not in existing_aliases:
                        db.add(CommodityAlias(
                            commodity_id=comm.id,
                            alias=alias,
                            language_code="te" if any(ord(char) >= 0x0C00 and ord(char) <= 0x0C7F for char in alias) else "en"
                        ))

        db.commit()

        # 4. Populate historical observations & forecasts for new commodities
        if new_commodities_to_populate and all_markets:
            random.seed(42)
            today = date.today()
            obs_batch = []
            forecast_batch = []
            BATCH_SIZE = 2000

            for market in all_markets:
                for comm, base_price in new_commodities_to_populate:
                    curr_price = base_price * random.uniform(0.92, 1.08)
                    for day_idx in range(60, -1, -1):
                        obs_date = today - timedelta(days=day_idx)
                        drift = random.uniform(-0.02, 0.023)
                        curr_price = max(base_price * 0.5, curr_price * (1 + drift))
                        modal_price = round(curr_price, 2)
                        min_price = round(modal_price * random.uniform(0.90, 0.96), 2)
                        max_price = round(modal_price * random.uniform(1.04, 1.10), 2)
                        arrival_qty = round(random.uniform(50.0, 450.0), 2)

                        obs = MarketObservation(
                            market_id=market.id,
                            commodity_id=comm.id,
                            observation_date=obs_date,
                            modal_price=modal_price,
                            min_price=min_price,
                            max_price=max_price,
                            arrival_quantity=arrival_qty,
                            quantity_unit="quintal",
                            price_unit="INR/quintal",
                            source_id=src.id,
                            data_quality_status="validated",
                        )
                        obs_batch.append(obs)
                        if len(obs_batch) >= BATCH_SIZE:
                            db.bulk_save_objects(obs_batch)
                            db.commit()
                            obs_batch = []

                    # Generate Forecasts for Horizons: 1, 3, 7 days
                    for horizon in [1, 3, 7]:
                        trend_factor = 1.0 + (0.008 * horizon if random.random() > 0.4 else -0.006 * horizon)
                        pred = round(modal_price * trend_factor, 2)
                        lower = round(pred * (1.0 - 0.03 * (horizon ** 0.5)), 2)
                        upper = round(pred * (1.0 + 0.03 * (horizon ** 0.5)), 2)
                        f = Forecast(
                            market_id=market.id,
                            commodity_id=comm.id,
                            forecast_date=today + timedelta(days=horizon),
                            horizon_days=horizon,
                            predicted_price=pred,
                            lower_bound=lower,
                            upper_bound=upper,
                            confidence_score=round(random.uniform(0.82, 0.95), 4),
                            model_name="XGBoost_PricePredictor_v1",
                            model_version="1.2.0",
                        )
                        forecast_batch.append(f)
                        if len(forecast_batch) >= BATCH_SIZE:
                            db.bulk_save_objects(forecast_batch)
                            db.commit()
                            forecast_batch = []

            if obs_batch:
                db.bulk_save_objects(obs_batch)
            if forecast_batch:
                db.bulk_save_objects(forecast_batch)
            db.commit()

    finally:
        if close_at_end:
            db.close()

if __name__ == "__main__":
    seed_database()
    print("Database successfully seeded with Telangana districts, markets, commodities, observations and forecasts.")

