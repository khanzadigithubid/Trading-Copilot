"""
Public chat endpoint — no authentication required.
Used by the landing page chat widget.
Fetches live prices and uses AI to answer trading questions.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.chat_service import chat_service

router = APIRouter(prefix="/public", tags=["public"])


class PublicChatRequest(BaseModel):
    query: str
    symbol: str | None = None


class PublicChatResponse(BaseModel):
    response: str
    source: str


@router.post("/chat", response_model=PublicChatResponse)
async def public_chat(payload: PublicChatRequest, db: Session = Depends(get_db)):
    """Public chat — no login needed. Used by landing page widget. Supports all languages."""
    # Detect language hint from query and pass to chat service
    result = await chat_service.answer_query(
        query=payload.query,
        db=db,
        symbol=payload.symbol,
    )
    return PublicChatResponse(
        response=result.response,
        source=result.source,
    )
