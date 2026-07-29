from enum import Enum

from pydantic import BaseModel, Field


class BacktestStrategy(str, Enum):
    rsi_macd = "rsi_macd"
    bollinger_bands = "bollinger_bands"
    ema_crossover = "ema_crossover"
    supertrend = "supertrend"
    mean_reversion = "mean_reversion"


class BacktestRange(str, Enum):
    w1 = "1w"
    m1 = "1m"
    y1 = "1y"


class BacktestRunRequest(BaseModel):
    symbol: str
    strategy: BacktestStrategy = BacktestStrategy.rsi_macd
    range: BacktestRange = BacktestRange.m1
    initial_capital: float = Field(default=10000.0, gt=0)


class BacktestTradeRecord(BaseModel):
    entry_time: str
    exit_time: str
    type: str
    entry_price: float
    exit_price: float
    pnl: float
    pnl_percent: float


class BacktestRunResponse(BaseModel):
    symbol: str
    strategy: str
    range: str
    initial_capital: float
    final_capital: float
    total_return_pct: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    max_drawdown_pct: float
    trades: list[BacktestTradeRecord]
