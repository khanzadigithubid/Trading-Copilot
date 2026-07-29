from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class MarketType(str, Enum):
    forex = "forex"
    crypto = "crypto"
    stock = "stock"


class HistoryRange(str, Enum):
    d1 = "1d"
    w1 = "1w"
    m1 = "1m"
    y1 = "1y"


class AssetResponse(BaseModel):
    id: str | None = None
    symbol: str
    market_type: MarketType
    name: str | None = None


class PriceResponse(BaseModel):
    symbol: str
    market_type: MarketType
    price: float
    change: float | None = None
    change_percent: float | None = None
    currency: str = "USD"
    timestamp: datetime
    source: str = "live"


class OHLCVBar(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float | None = None


class HistoryResponse(BaseModel):
    symbol: str
    market_type: MarketType
    range: HistoryRange
    bars: list[OHLCVBar]
    source: str = "live"


class PriceUpdate(BaseModel):
    symbol: str
    market_type: MarketType
    price: float
    change: float | None = None
    change_percent: float | None = None
    timestamp: datetime


class WSSubscribeMessage(BaseModel):
    action: str = Field(default="subscribe")
    symbols: list[str] = Field(default_factory=list)
