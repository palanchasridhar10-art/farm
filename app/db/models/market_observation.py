"""MarketObservation ORM model."""

from datetime import datetime, timezone
from sqlalchemy import (
    BigInteger, Date, DateTime, ForeignKey, Index, Integer, Numeric, String, UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class MarketObservation(Base):
    __tablename__ = "market_observations"
    __table_args__ = (
        UniqueConstraint(
            "market_id", "commodity_id", "observation_date", "source_id",
            name="uq_observation_identity",
        ),
        Index(
            "idx_market_observation_lookup",
            "market_id", "commodity_id", "observation_date",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey("markets.id"), nullable=False)
    commodity_id: Mapped[int] = mapped_column(Integer, ForeignKey("commodities.id"), nullable=False)
    observation_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    min_price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    modal_price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    max_price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    arrival_quantity: Mapped[float | None] = mapped_column(Numeric(14, 3), nullable=True)
    quantity_unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    price_unit: Mapped[str | None] = mapped_column(String(50), nullable=True, default="INR/quintal")
    source_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source_record_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    data_quality_status: Mapped[str] = mapped_column(String(30), nullable=False, default="validated")
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    market = relationship("Market", back_populates="observations")
    commodity = relationship("Commodity")
