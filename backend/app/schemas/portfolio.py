from pydantic import BaseModel


class EquityPoint(BaseModel):
    date: str
    equity: float
    pnl: float


class StreakInfo(BaseModel):
    current_win_streak: int
    current_loss_streak: int
    best_win_streak: int
    worst_loss_streak: int


class PortfolioStats(BaseModel):
    user_id: str
    initial_capital: float
    current_equity: float
    total_pnl: float
    total_pnl_pct: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    avg_win: float
    avg_loss: float
    profit_factor: float
    sharpe_ratio: float
    max_drawdown_pct: float
    best_trade: float
    worst_trade: float
    streaks: StreakInfo
    equity_curve: list[EquityPoint]
