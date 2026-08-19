"""Market ORM model."""

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Market(Base):
    __tablename__ = "markets"
    __table_args__ = (UniqueConstraint("district_id", "slug", name="uq_market_district_slug"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_id: Mapped[int] = mapped_column(Integer, ForeignKey("districts.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(150), nullable=False)
    source_market_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # Relationships
    district = relationship("District", back_populates="markets")
    observations = relationship("MarketObservation", back_populates="market", lazy="dynamic")
    forecasts = relationship("Forecast", back_populates="market", lazy="dynamic")
