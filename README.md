# 🌾 Farmer Market AI

**AI-Based Agricultural Market Price Prediction System for Telangana**

An intelligent farmer-focused market information platform that combines verified market data, ML price forecasting, and a grounded AI chatbot.

## Features

- **5 Telangana Districts**: Nizamabad, Karimnagar, Warangal, Nalgonda, Khammam
- **10+ Commodities**: Tomato, Cotton, Turmeric, Paddy, Maize, Red Chilli, Onion, Groundnut, Bengal Gram, Red Gram
- **ML Forecasting**: 1-day, 3-day, and 7-day price predictions with confidence intervals
- **District Comparison**: Compare prices across all five districts
- **AI Chatbot**: Tool-grounded chatbot (English + Telugu) that never invents prices
- **Premium Dashboard**: Dark theme with Chart.js visualizations

## Quick Start

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000

The database auto-seeds on first run with 60 days of demo market observations.

## Architecture

```
Market Data → Clean Data → Feature Store → ML Forecast Engine
                                        ↓
                                  Decision Engine
                                  ↓             ↓
                            Dashboard      AI Chatbot
                                  ↓             ↓
                              Farmer-facing Answer
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health` | Health check |
| `GET /api/v1/districts` | List districts |
| `GET /api/v1/commodities` | List commodities |
| `GET /api/v1/prices/latest` | Latest price |
| `GET /api/v1/prices/history` | Price history |
| `GET /api/v1/forecast` | ML forecast |
| `GET /api/v1/compare` | District comparison |
| `POST /api/v1/chat` | AI chatbot |

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **ML**: XGBoost, scikit-learn, pandas, NumPy
- **Frontend**: Jinja2, Chart.js, vanilla CSS/JS
- **AI**: OpenRouter (optional), rule-based fallback

## Render Deployment

Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
