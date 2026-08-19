"""Commodity ORM model."""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Commodity(Base):
    __tablename__ = "commodities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    canonical_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    local_name_te: Mapped[str | None] = mapped_column(String(150), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    sub_category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    default_unit: Mapped[str | None] = mapped_column(String(50), nullable=True, default="quintal")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # Relationships
    aliases = relationship("CommodityAlias", back_populates="commodity", lazy="selectin")
