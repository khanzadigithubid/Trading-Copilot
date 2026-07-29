from pydantic import BaseModel, Field


class PositionSizeResponse(BaseModel):
    symbol: str
    entry: float
    stop_loss: float
    capital: float
    risk_tolerance_pct: float
    risk_amount: float
    risk_per_unit: float
    suggested_size: float
    max_loss: float
    note: str


class RiskAlert(BaseModel):
    type: str
    severity: str
    message: str


class UserRiskSummary(BaseModel):
    user_id: str
    capital: float
    risk_tolerance_pct: float
    trades_today: int
    max_daily_trades: int
    overtrading: bool
    open_trades: int
    closed_trades: int
    total_pnl: float
    drawdown_pct: float
    peak_equity: float
    current_equity: float
    alerts: list[RiskAlert] = Field(default_factory=list)
