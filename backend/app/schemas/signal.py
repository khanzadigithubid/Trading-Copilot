from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class SignalAction(str, Enum):
    buy = "BUY"
    sell = "SELL"
    hold = "HOLD"


class RiskLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TechnicalIndicators(BaseModel):
    rsi: float | None = None
    macd: float | None = None
    macd_signal: float | None = None
    ma50: float | None = None
    ma200: float | None = None


class SignalResponse(BaseModel):
    id: str | None = None
    symbol: str
    signal: SignalAction
    confidence: float = Field(ge=0, le=100)
    reasoning: str
    risk_level: RiskLevel
    indicators: TechnicalIndicators | None = None
    created_at: datetime | None = None
    source: str = "ai"


class SignalHistoryResponse(BaseModel):
    symbol: str
    signals: list[SignalResponse]
