"""FastAPI dependency injection."""

from app.db.session import get_db

# Re-export for clean imports
get_db_session = get_db
