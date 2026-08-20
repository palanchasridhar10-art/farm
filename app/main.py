"""FastAPI application entry point."""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import create_all_tables
from app.api.chat import router as chat_router
from app.api.routes_health import router as health_router
from app.api.routes_markets import router as markets_router
from app.api.routes_prices import router as prices_router
from app.api.routes_forecasts import router as forecasts_router

import logging
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ─── Startup ─────────────────────────────────────────────────────────────
    # 1. Create DB tables and seed initial data if empty
    try:
        create_all_tables()
        from app.db.session import SessionLocal
        from app.db.models.district import District
        db = SessionLocal()
        try:
            if not db.query(District).first():
                from scripts.seed_data import seed_database
                seed_database(db)
        finally:
            db.close()
        logger.info("Database initialized successfully.")
    except Exception as exc:
        logger.error(f"Database initialization warning (will continue startup): {exc}")

    # 2. Start daily price updater scheduler (runs at 06:00 IST = 00:30 UTC)
    scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
    try:
        from app.services.daily_price_updater import update_daily_prices
        # Run immediately on startup to ensure today's prices exist
        update_daily_prices()
        logger.info("[DailyPriceUpdater] Initial price update completed.")
        # Schedule daily at 06:00 IST
        scheduler.add_job(
            update_daily_prices,
            trigger=CronTrigger(hour=6, minute=0, timezone="Asia/Kolkata"),
            id="daily_price_update",
            replace_existing=True,
            max_instances=1,
        )
        scheduler.start()
        logger.info("[DailyPriceUpdater] Scheduler started — daily updates at 06:00 IST.")
    except Exception as exc:
        logger.error(f"[DailyPriceUpdater] Scheduler startup failed (non-critical): {exc}")

    yield

    # ─── Shutdown ────────────────────────────────────────────────────────────
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
            logger.info("[DailyPriceUpdater] Scheduler stopped.")
    except Exception:
        pass


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Based Farmer Market Price Prediction System for Telangana",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files & templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Register API routers
app.include_router(health_router)
app.include_router(markets_router)
app.include_router(prices_router)
app.include_router(forecasts_router)
app.include_router(chat_router)



@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
