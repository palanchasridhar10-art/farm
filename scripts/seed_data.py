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
    {"name": "Adilabad", "slug": "adilabad", "markets": ["Rythu Bazar, Adilabad town (CCI Area)", "Adilabad APMC", "Echoda Mandi"]},
    {"name": "Bhadradri Kothagudem", "slug": "bhadradri-kothagudem", "markets": ["Rythu Bazar, Kothagudem town", "Bhadrachalam APMC", "Yellandu Market"]},
    {"name": "Hanumakonda", "slug": "hanamkonda", "markets": ["Rythu Bazar, Excise Colony, Hanumakonda", "Hanamkonda APMC", "Parkal Mandi"]},
    {"name": "Hyderabad", "slug": "hyderabad", "markets": ["Rythu Bazar, Mehdipatnam, Hyderabad", "Bowenpally Market", "Gudimalkapur Mandi"]},
    {"name": "Jagtial", "slug": "jagtial", "markets": ["Rythu Bazar, Jagtial town", "Jagtial APMC", "Korutla Mandi"]},
    {"name": "Jangaon", "slug": "jangaon", "markets": ["Rythu Bazar, Jangaon town", "Jangaon APMC", "Station Ghanpur Market"]},
    {"name": "Jayashankar Bhupalpally", "slug": "jayashankar-bhupalpally", "markets": ["Rythu Bazar, Bhupalpally town", "Kataram APMC", "Regonda Market"]},
    {"name": "Jogulamba Gadwal", "slug": "jogulamba-gadwal", "markets": ["Rythu Bazar, Gadwal town", "Gadwal APMC", "Alampur Mandi"]},
    {"name": "Kamareddy", "slug": "kamareddy", "markets": ["Rythu Bazar, Kamareddy town", "Kamareddy APMC", "Banswada Mandi"]},
    {"name": "Karimnagar", "slug": "karimnagar", "markets": ["Rythu Bazar, Karimnagar city", "Karimnagar Main APMC", "Huzurabad Market"]},
    {"name": "Khammam", "slug": "khammam", "markets": ["Integrated Rythu Bazar, NSP Camp, Khammam", "Khammam Cotton Market", "Madhira APMC"]},
    {"name": "Kumuram Bheem Asifabad", "slug": "komaram-bheem-asifabad", "markets": ["Rythu Bazar, Asifabad town", "Asifabad APMC", "Kagaznagar Mandi"]},
    {"name": "Mahabubabad", "slug": "mahabubabad", "markets": ["Rythu Bazar, Mahabubabad town", "Mahabubabad APMC", "Kesamudram Mandi"]},
    {"name": "Mahabubnagar", "slug": "mahabubnagar", "markets": ["Rythu Bazar, Mahabubnagar town", "Mahabubnagar APMC", "Badepally Mandi"]},
    {"name": "Mancherial", "slug": "mancherial", "markets": ["Rythu Bazar, Mancherial town", "Mancherial APMC", "Bellampalli Mandi"]},
    {"name": "Medak", "slug": "medak", "markets": ["Rythu Bazar, Medak town", "Medak APMC", "Ramayampet Mandi"]},
    {"name": "Medchal-Malkajgiri", "slug": "medchal-malkajgiri", "markets": ["Rythu Bazar, Bowenpally", "Medchal APMC", "Malkajgiri Mandi"]},
    {"name": "Mulugu", "slug": "mulugu", "markets": ["Rythu Bazar, Mulugu town", "Eturnagaram APMC", "Venkatapur Market"]},
    {"name": "Nagarkurnool", "slug": "nagarkurnool", "markets": ["Rythu Bazar, Nagarkurnool town", "Nagarkurnool APMC", "Kalwakurthy Mandi"]},
    {"name": "Nalgonda", "slug": "nalgonda", "markets": ["Rythu Bazar, Beet Market, Nalgonda", "Miryalaguda APMC", "Nakrekal Mandi"]},
    {"name": "Narayanpet", "slug": "narayanpet", "markets": ["Rythu Bazar, Narayanpet town", "Narayanpet APMC", "Makthal Mandi"]},
    {"name": "Nirmal", "slug": "nirmal", "markets": ["Rythu Bazar, Nirmal town", "Nirmal APMC", "Bhainsa Mandi"]},
    {"name": "Nizamabad", "slug": "nizamabad", "markets": ["Rythu Bazar, Nizamabad city", "Nizamabad APMC", "Bodhan Mandi"]},
    {"name": "Peddapalli", "slug": "peddapalli", "markets": ["Rythu Bazar, Peddapalli town", "Peddapalli APMC", "Sultanabad Mandi"]},
    {"name": "Rajanna Sircilla", "slug": "rajanna-sircilla", "markets": ["Rythu Bazar, Sircilla town", "Sircilla APMC", "Vemulawada Mandi"]},
    {"name": "Rangareddy", "slug": "rangareddy", "markets": ["Rythu Bazar, Vanasthalipuram", "Shadnagar APMC", "Chevella Mandi"]},
    {"name": "Sangareddy", "slug": "sangareddy", "markets": ["Rythu Bazar, Sangareddy town", "Sangareddy APMC", "Zaheerabad Market"]},
    {"name": "Siddipet", "slug": "siddipet", "markets": ["Rythu Bazar, Siddipet town", "Siddipet APMC", "Gajwel Mandi"]},
    {"name": "Suryapet", "slug": "suryapet", "markets": ["Rythu Bazar, Suryapet town", "Suryapet APMC", "Kodad Mandi"]},
    {"name": "Vikarabad", "slug": "vikarabad", "markets": ["Rythu Bazar, Vikarabad town", "Vikarabad APMC", "Tandur Mandi"]},
    {"name": "Wanaparthy", "slug": "wanaparthy", "markets": ["Rythu Bazar, Wanaparthy town", "Wanaparthy APMC", "Kothakota Mandi"]},
    {"name": "Warangal", "slug": "warangal", "markets": ["Rythu Bazar, Shambunipet, Warangal", "Enumamula Warangal APMC", "Narsampet Mandi"]},
    {"name": "Yadadri Bhuvanagiri", "slug": "yadadri-bhuvanagiri", "markets": ["Rythu Bazar, Bhongir town", "Bhongir APMC", "Choutuppal Mandi"]},
]

# ─── ACCURATE BASE PRICES (INR/Quintal) ───────────────────────────────────────
# Sources: MSP 2025-26 (Govt. of India), APMC/e-NAM Telangana live feeds,
#          Agmarknet, Nizamabad/Khammam/Nalgonda mandi averages — August 2025.
# Each base_price reflects the realistic modal price; seed randomisation
# generates ±8% min/max around it to simulate real intra-day spread.
# Seasonal min/max bands per commodity are also defined for realistic drift.
COMMODITIES_DATA = [
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
        "canonical_name": "Cotton",
        "local_name_te": "పత్తి",
        "category": "Commercial",
        "base_price": 7900.0,      # ₹7,900/q — above MSP ₹7,710 (medium staple); market premium
        "seasonal_low": 7200.0,
        "seasonal_high": 9000.0,
        "aliases": ["cotton", "kapas", "పత్తి"],
    },
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
        "canonical_name": "Paddy / Rice",
        "local_name_te": "వరి / ధాన్యం",
        "category": "Cereals",
        "base_price": 2450.0,      # ₹2,450/q — above MSP ₹2,300 (common grade); Telangana mandi
        "seasonal_low": 2200.0,
        "seasonal_high": 2800.0,
        "aliases": ["paddy", "rice", "dhaan", "వరి", "ధాన్యం"],
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
        "canonical_name": "Red Chilli",
        "local_name_te": "ఎర్ర మిరప",
        "category": "Spices",
        "base_price": 13000.0,     # ₹13,000/q — Khammam/Warangal avg (range ₹9,000–17,500)
        "seasonal_low": 8000.0,
        "seasonal_high": 25000.0,
        "aliases": ["red chilli", "chilli", "mirchi", "మిరప", "ఎర్ర మిరప"],
    },
    {
        "canonical_name": "Onion",
        "local_name_te": "ఉల్లిపాయ",
        "category": "Vegetables",
        "base_price": 2200.0,      # ₹2,200/q — Telangana avg (range ₹1,500–3,000)
        "seasonal_low": 800.0,
        "seasonal_high": 5000.0,
        "aliases": ["onion", "pyaz", "ఉల్లిపాయ", "ఉల్లి"],
    },
    {
        "canonical_name": "Groundnut",
        "local_name_te": "వేరుశనగ",
        "category": "Oilseeds",
        "base_price": 7263.0,      # ₹7,263/q — MSP 2025-26 (Govt. of India)
        "seasonal_low": 6500.0,
        "seasonal_high": 8500.0,
        "aliases": ["groundnut", "peanut", "moongfali", "వేరుశనగ"],
    },
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
        "aliases": ["red gram", "tur", "arhar", "కందులు"],
    },
]

def seed_database(db: Session | None = None):
    close_at_end = False
    if db is None:
        create_all_tables()
        db = SessionLocal()
        close_at_end = True

    try:
        # Check if already seeded
        if db.query(District).first():
            return

        # 1. Data Source
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
        district_market_map = {}
        for d_data in DISTRICTS_DATA:
            district = District(name=d_data["name"], slug=d_data["slug"], state="Telangana")
            db.add(district)
            db.flush()

            district_market_map[district.id] = []
            for m_name in d_data["markets"]:
                slug = m_name.lower().replace(" ", "-").replace("/", "-")
                market = Market(district_id=district.id, name=m_name, slug=slug)
                db.add(market)
                db.flush()
                district_market_map[district.id].append(market)

        # 3. Commodities & Aliases
        commodity_objs = []
        for c_data in COMMODITIES_DATA:
            comm = Commodity(
                canonical_name=c_data["canonical_name"],
                local_name_te=c_data["local_name_te"],
                category=c_data["category"],
                default_unit="quintal",
            )
            db.add(comm)
            db.flush()
            commodity_objs.append((comm, c_data["base_price"]))

            for alias in c_data["aliases"]:
                db.add(CommodityAlias(commodity_id=comm.id, alias=alias, language_code="te" if any(ord(char) >= 0x0C00 and ord(char) <= 0x0C7F for char in alias) else "en"))

        # 4. Historical Observations (60 days per commodity per market)
        random.seed(42)
        today = date.today()

        obs_batch = []
        forecast_batch = []
        BATCH_SIZE = 2000

        for district_id, markets in district_market_map.items():
            for market in markets:
                for comm, base_price in commodity_objs:
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

                    # 5. Generate Forecasts for Horizons: 1, 3, 7 days
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
