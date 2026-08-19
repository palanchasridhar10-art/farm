"""CommodityAlias ORM model."""

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class CommodityAlias(Base):
    __tablename__ = "commodity_aliases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    commodity_id: Mapped[int] = mapped_column(Integer, ForeignKey("commodities.id"), nullable=False)
    alias: Mapped[str] = mapped_column(String(150), nullable=False)
    language_code: Mapped[str] = mapped_column(String(10), nullable=False, default="en")

    # Relationships
    commodity = relationship("Commodity", back_populates="aliases")
