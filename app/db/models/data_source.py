"""DataSource ORM model — registry of market data sources."""

from datetime import datetime, timezone
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class DataSource(Base):
    __tablename__ = "data_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="csv")
    update_frequency: Mapped[str | None] = mapped_column(String(50), nullable=True)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="active")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
