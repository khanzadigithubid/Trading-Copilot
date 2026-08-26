from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class TradeType(str, Enum):
    buy = "BUY"
    sell = "SELL"


class TradeStatus(str, Enum):
    open = "open"
    closed = "closed"


class PaperTradeOpenRequest(BaseModel):
    symbol: str
    type: TradeType
    size: float = Field(gt=0)
    entry_price: float | None = Field(default=None, gt=0)
    stop_loss: float | None = Field(default=None, gt=0, description="Optional stop loss price")
    take_profit: float | None = Field(default=None, gt=0, description="Optional take profit price")


class TradeCloseRequest(BaseModel):
    exit_price: float | None = Field(default=None, gt=0)


class TradeResponse(BaseModel):
    id: str
    user_id: str
    symbol: str
    market_type: str
    type: TradeType
    entry_price: float
    exit_price: float | None = None
    stop_loss: float | None = None
    take_profit: float | None = None
    size: float
    status: TradeStatus
    is_paper: bool
    pnl: float | None = None
    pnl_percent: float | None = None
    created_at: datetime
    closed_at: datetime | None = None


class TradeListResponse(BaseModel):
    user_id: str
    trades: list[TradeResponse]
    open_count: int
    closed_count: int
    total_realized_pnl: float
