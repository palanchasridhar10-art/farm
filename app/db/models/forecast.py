"""Forecast ORM model."""

from datetime import datetime, timezone
from sqlalchemy import BigInteger, Date, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Forecast(Base):
    __tablename__ = "forecasts"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey("markets.id"), nullable=False)
    commodity_id: Mapped[int] = mapped_column(Integer, ForeignKey("commodities.id"), nullable=False)
    forecast_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    horizon_days: Mapped[int] = mapped_column(Integer, nullable=False)
    predicted_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    lower_bound: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    upper_bound: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(6, 4), nullable=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(100), nullable=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    market = relationship("Market", back_populates="forecasts")
    commodity = relationship("Commodity")
