from datetime import datetime

from pydantic import BaseModel


class JournalEntry(BaseModel):
    trade_id: str
    symbol: str
    type: str
    entry_price: float
    exit_price: float
    size: float
    pnl: float
    pnl_percent: float
    duration_minutes: int
    ai_analysis: str
    lesson: str
    rating: str          # "excellent" | "good" | "poor"
    created_at: datetime


class JournalResponse(BaseModel):
    entries: list[JournalEntry]
    total: int
