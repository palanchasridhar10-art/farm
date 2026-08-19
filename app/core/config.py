"""Application configuration loaded from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root
_env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(_env_path)


class Settings:
    """Central configuration — reads from environment with sane defaults."""

    APP_ENV: str = os.getenv("APP_ENV", "development")
    APP_NAME: str = os.getenv("APP_NAME", "Farmer Market AI")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./farmer_market_ai.db")

    # OpenRouter
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = os.getenv(
        "OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"
    )
    OPENROUTER_MODEL: str = os.getenv(
        "OPENROUTER_MODEL", "google/gemma-4-31b-it:free"
    )
    OPENROUTER_FALLBACK_MODEL: str = os.getenv(
        "OPENROUTER_FALLBACK_MODEL", "openrouter/free"
    )

    # Paths
    MODEL_DIR: str = os.getenv("MODEL_DIR", "./models/artifacts")
    DATA_DIR: str = os.getenv("DATA_DIR", "./data")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    CORS_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:3000,http://localhost:8000"
        ).split(",")
    ]

    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    @property
    def llm_available(self) -> bool:
        """True when a valid OpenRouter API key is configured."""
        return bool(self.OPENROUTER_API_KEY and self.OPENROUTER_API_KEY.startswith("sk-"))


settings = Settings()
