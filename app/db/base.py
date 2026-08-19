"""SQLAlchemy base, engine, and table-creation helper."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=False,
)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


def create_all_tables():
    """Create every table that inherits from Base (idempotent)."""
    # Import all models so they register with Base.metadata
    import app.db.models.district  # noqa: F401
    import app.db.models.market  # noqa: F401
    import app.db.models.commodity  # noqa: F401
    import app.db.models.commodity_alias  # noqa: F401
    import app.db.models.market_observation  # noqa: F401
    import app.db.models.forecast  # noqa: F401
    import app.db.models.model_run  # noqa: F401
    import app.db.models.data_source  # noqa: F401
    import app.db.models.chat  # noqa: F401

    Base.metadata.create_all(bind=engine)
