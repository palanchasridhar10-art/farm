"""ModelRun ORM model — tracks ML training runs."""

from datetime import datetime, timezone
from sqlalchemy import BigInteger, Date, DateTime, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class ModelRun(Base):
    __tablename__ = "model_runs"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(100), nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    dataset_start: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    dataset_end: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    training_rows: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    metrics_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
