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

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe startup: create tables and seed demo data if empty
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
    yield


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
