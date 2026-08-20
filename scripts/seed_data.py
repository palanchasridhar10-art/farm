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
    {"name": "Adilabad", "slug": "adilabad", "markets": ["Adilabad APMC", "Echoda Mandi", "Boath Market"]},
    {"name": "Bhadradri Kothagudem", "slug": "bhadradri-kothagudem", "markets": ["Kothagudem Mandi", "Bhadrachalam APMC", "Yellandu Market"]},
    {"name": "Hanamkonda", "slug": "hanamkonda", "markets": ["Hanamkonda APMC", "Parkal Mandi", "Kamalapur Market"]},
    {"name": "Hyderabad", "slug": "hyderabad", "markets": ["Bowenpally Market", "Gaddiannaram APMC", "Gudimalkapur Mandi"]},
    {"name": "Jagtial", "slug": "jagtial", "markets": ["Jagtial APMC", "Korutla Mandi", "Metpally Market"]},
    {"name": "Jangaon", "slug": "jangaon", "markets": ["Jangaon APMC", "Bachannapet Mandi", "Station Ghanpur Market"]},
    {"name": "Jayashankar Bhupalpally", "slug": "jayashankar-bhupalpally", "markets": ["Bhupalpally Mandi", "Kataram APMC", "Regonda Market"]},
    {"name": "Jogulamba Gadwal", "slug": "jogulamba-gadwal", "markets": ["Gadwal APMC", "Alampur Mandi", "Ieeja Market"]},
    {"name": "Kamareddy", "slug": "kamareddy", "markets": ["Kamareddy APMC", "Banswada Mandi", "Yellareddy Market"]},
    {"name": "Karimnagar", "slug": "karimnagar", "markets": ["Karimnagar Main APMC", "Huzurabad Market", "Jammikunta Mandi"]},
    {"name": "Khammam", "slug": "khammam", "markets": ["Khammam Cotton Market", "Madhira APMC", "Wyra Mandi"]},
    {"name": "Komaram Bheem Asifabad", "slug": "komaram-bheem-asifabad", "markets": ["Asifabad APMC", "Kagaznagar Mandi", "Rebbena Market"]},
    {"name": "Mahabubabad", "slug": "mahabubabad", "markets": ["Mahabubabad APMC", "Kesamudram Mandi", "Thorrur Market"]},
    {"name": "Mahabubnagar", "slug": "mahabubnagar", "markets": ["Mahabubnagar APMC", "Badepally Mandi", "Jadcherla Market"]},
    {"name": "Mancherial", "slug": "mancherial", "markets": ["Mancherial APMC", "Bellampalli Mandi", "Chennur Market"]},
    {"name": "Medak", "slug": "medak", "markets": ["Medak APMC", "Ramayampet Mandi", "Toopran Market"]},
    {"name": "Medchal-Malkajgiri", "slug": "medchal-malkajgiri", "markets": ["Medchal APMC", "Keesara Market", "Malkajgiri Mandi"]},
    {"name": "Mulugu", "slug": "mulugu", "markets": ["Mulugu Mandi", "Eturnagaram APMC", "Venkatapur Market"]},
    {"name": "Nagarkurnool", "slug": "nagarkurnool", "markets": ["Nagarkurnool APMC", "Kalwakurthy Mandi", "Achampet Market"]},
    {"name": "Nalgonda", "slug": "nalgonda", "markets": ["Nalgonda Rythu Market", "Miryalaguda APMC", "Nakrekal Mandi"]},
    {"name": "Narayanpet", "slug": "narayanpet", "markets": ["Narayanpet APMC", "Makthal Mandi", "Kosgi Market"]},
    {"name": "Nirmal", "slug": "nirmal", "markets": ["Nirmal APMC", "Bhainsa Mandi", "Khanapur Market"]},
    {"name": "Nizamabad", "slug": "nizamabad", "markets": ["Nizamabad APMC", "Bodhan Mandi", "Armoor Market"]},
    {"name": "Peddapalli", "slug": "peddapalli", "markets": ["Peddapalli APMC", "Sultanabad Mandi", "Ramagundam Market"]},
    {"name": "Rajanna Sircilla", "slug": "rajanna-sircilla", "markets": ["Sircilla APMC", "Vemulawada Mandi", "Mustabad Market"]},
    {"name": "Rangareddy", "slug": "rangareddy", "markets": ["Shadnagar APMC", "Chevella Mandi", "Ibrahimpatnam Market"]},
    {"name": "Sangareddy", "slug": "sangareddy", "markets": ["Sangareddy APMC", "Sadasivpet Mandi", "Zaheerabad Market"]},
    {"name": "Siddipet", "slug": "siddipet", "markets": ["Siddipet APMC", "Gajwel Mandi", "Dubbak Market"]},
    {"name": "Suryapet", "slug": "suryapet", "markets": ["Suryapet APMC", "Kodad Mandi", "Huzurnagar Market"]},
    {"name": "Vikarabad", "slug": "vikarabad", "markets": ["Vikarabad APMC", "Tandur Mandi", "Parigi Market"]},
    {"name": "Wanaparthy", "slug": "wanaparthy", "markets": ["Wanaparthy APMC", "Kothakota Mandi", "Pebbair Market"]},
    {"name": "Warangal", "slug": "warangal", "markets": ["Enumamula Warangal APMC", "Narsampet Mandi", "Wardhannapet Market"]},
    {"name": "Yadadri Bhuvanagiri", "slug": "yadadri-bhuvanagiri", "markets": ["Bhongir APMC", "Choutuppal Mandi", "Alair Market"]},
]

COMMODITIES_DATA = [
    {"canonical_name": "Tomato", "local_name_te": "టమాటా", "category": "Vegetables", "base_price": 2400.0, "aliases": ["tomato", "tomatoes", "tamatar", "టమాటా", "టమోటా"]},
    {"canonical_name": "Cotton", "local_name_te": "పత్తి", "category": "Commercial", "base_price": 7100.0, "aliases": ["cotton", "kapas", "పత్తి"]},
    {"canonical_name": "Turmeric", "local_name_te": "పసుపు", "category": "Commercial", "base_price": 11500.0, "aliases": ["turmeric", "haldi", "పసుపు"]},
    {"canonical_name": "Paddy / Rice", "local_name_te": "వరి / ధాన్యం", "category": "Cereals", "base_price": 2250.0, "aliases": ["paddy", "rice", "dhaan", "వరి", "ధాన్యం"]},
    {"canonical_name": "Maize", "local_name_te": "మొక్కజొన్న", "category": "Cereals", "base_price": 2100.0, "aliases": ["maize", "corn", "makka", "మొక్కజొన్న"]},
    {"canonical_name": "Red Chilli", "local_name_te": "ఎర్ర మిరప", "category": "Spices", "base_price": 18500.0, "aliases": ["red chilli", "chilli", "mirchi", "మిరప", "ఎర్ర మిరప"]},
    {"canonical_name": "Onion", "local_name_te": "ఉల్లిపాయ", "category": "Vegetables", "base_price": 2200.0, "aliases": ["onion", "pyaz", "ఉల్లిపాయ", "ఉల్లి"]},
    {"canonical_name": "Groundnut", "local_name_te": "వేరుశనగ", "category": "Oilseeds", "base_price": 6400.0, "aliases": ["groundnut", "peanut", "moongfali", "వేరుశనగ"]},
    {"canonical_name": "Bengal Gram", "local_name_te": "శనగలు", "category": "Pulses", "base_price": 5800.0, "aliases": ["bengal gram", "chickpea", "chana", "శనగలు"]},
    {"canonical_name": "Red Gram / Tur", "local_name_te": "కందులు", "category": "Pulses", "base_price": 9600.0, "aliases": ["red gram", "tur", "arhar", "కందులు"]},
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
                        db.add(obs)

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
                        db.add(f)

        db.commit()
    finally:
        if close_at_end:
            db.close()

if __name__ == "__main__":
    seed_database()
    print("Database successfully seeded with Telangana districts, markets, commodities, observations and forecasts.")
