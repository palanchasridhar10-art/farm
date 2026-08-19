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

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Based Farmer Market Price Prediction System for Telangana",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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


@app.on_event("startup")
def startup():
    create_all_tables()
    # Auto-seed if DB is empty
    from app.db.session import SessionLocal
    from app.db.models.district import District
    db = SessionLocal()
    try:
        if not db.query(District).first():
            from scripts.seed_data import seed_database
            seed_database(db)
    finally:
        db.close()


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
