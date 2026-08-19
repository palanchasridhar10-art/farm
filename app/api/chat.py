"""Chat API endpoint."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.chatbot.agent import handle_chat

router = APIRouter(prefix="/api/v1", tags=["chat"])

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    language: str = "en"

@router.post("/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    return handle_chat(db, req.message, req.language)
