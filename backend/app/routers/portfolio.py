import math

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.models.trade import Trade
from app.models.user import User
from app.schemas.portfolio import EquityPoint, PortfolioStats, StreakInfo
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("/stats", response_model=PortfolioStats)
def get_portfolio_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    closed_trades = (
        db.query(Trade, Asset)
        .join(Asset, Trade.asset_id == Asset.id)
        .filter(Trade.user_id == current_user.id, Trade.status == "closed")
        .order_by(Trade.created_at.asc())
        .all()
    )

    pnls: list[float] = []
    equity_curve: list[EquityPoint] = []
    equity = current_user.capital

    for trade, asset in closed_trades:
        if not (trade.entry_price and trade.exit_price and trade.size):
            continue
        trade_type = (trade.type or "").upper()
        if trade_type == "BUY":
            pnl = (trade.exit_price - trade.entry_price) * trade.size
        else:
            pnl = (trade.entry_price - trade.exit_price) * trade.size
        pnl = round(pnl, 2)
        equity = round(equity + pnl, 2)
        pnls.append(pnl)
        equity_curve.append(
            EquityPoint(
                date=trade.created_at.strftime("%Y-%m-%d %H:%M"),
                equity=equity,
                pnl=pnl,
            )
        )

    total = len(pnls)
    wins = [p for p in pnls if p > 0]
    losses = [p for p in pnls if p <= 0]
    total_pnl = round(sum(pnls), 2)
    win_rate = round((len(wins) / total * 100) if total else 0, 1)
    avg_win = round(sum(wins) / len(wins), 2) if wins else 0.0
    avg_loss = round(sum(losses) / len(losses), 2) if losses else 0.0
    gross_profit = sum(wins)
    gross_loss = abs(sum(losses))
    profit_factor = round(gross_profit / gross_loss, 2) if gross_loss > 0 else float("inf")

    # Sharpe ratio (simplified — daily returns approximation)
    if len(pnls) >= 2:
        mean_pnl = sum(pnls) / len(pnls)
        variance = sum((p - mean_pnl) ** 2 for p in pnls) / len(pnls)
        std_pnl = math.sqrt(variance)
        sharpe = round((mean_pnl / std_pnl) * math.sqrt(252), 2) if std_pnl > 0 else 0.0
    else:
        sharpe = 0.0

    # Max drawdown
    peak = current_user.capital
    max_dd = 0.0
    running = current_user.capital
    for p in pnls:
        running += p
        peak = max(peak, running)
        dd = ((peak - running) / peak * 100) if peak > 0 else 0
        max_dd = max(max_dd, dd)

    # Streaks
    cur_win = cur_loss = best_win = worst_loss = 0
    for p in pnls:
        if p > 0:
            cur_win += 1
            cur_loss = 0
            best_win = max(best_win, cur_win)
        else:
            cur_loss += 1
            cur_win = 0
            worst_loss = max(worst_loss, cur_loss)

    total_pnl_pct = round(
        (total_pnl / current_user.capital * 100) if current_user.capital > 0 else 0, 2
    )

    return PortfolioStats(
        user_id=str(current_user.id),
        initial_capital=current_user.capital,
        current_equity=round(equity, 2),
        total_pnl=total_pnl,
        total_pnl_pct=total_pnl_pct,
        total_trades=total,
        winning_trades=len(wins),
        losing_trades=len(losses),
        win_rate=win_rate,
        avg_win=avg_win,
        avg_loss=avg_loss,
        profit_factor=profit_factor if math.isfinite(profit_factor) else 999.0,
        sharpe_ratio=sharpe,
        max_drawdown_pct=round(max_dd, 2),
        best_trade=max(pnls) if pnls else 0.0,
        worst_trade=min(pnls) if pnls else 0.0,
        streaks=StreakInfo(
            current_win_streak=cur_win,
            current_loss_streak=cur_loss,
            best_win_streak=best_win,
            worst_loss_streak=worst_loss,
        ),
        equity_curve=equity_curve[-100:],  # last 100 points
    )


@router.get("/alpaca")
async def get_alpaca_account_info(
    current_user: User = Depends(get_current_user),
):
    """Return Alpaca paper account info — equity, buying power, positions."""
    from app.services.alpaca_broker import get_alpaca_account, get_alpaca_positions
    account = await get_alpaca_account()
    positions = await get_alpaca_positions()
    return {
        "connected": bool(account),
        "account": account,
        "positions": positions,
    }
