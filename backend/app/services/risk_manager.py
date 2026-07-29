from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.trade import Trade
from app.models.user import User
from app.schemas.risk import PositionSizeResponse, RiskAlert, UserRiskSummary
from app.services.market_data.catalog import get_asset

MAX_DAILY_TRADES = 5
DRAWDOWN_WARNING_PCT = 10.0


class RiskManager:
    def calculate_position_size(
        self,
        symbol: str,
        entry: float,
        stop_loss: float,
        capital: float,
        risk_tolerance_pct: float,
    ) -> PositionSizeResponse:
        asset = get_asset(symbol)
        if asset is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")

        if entry <= 0:
            raise ValueError("Entry price must be positive")
        if stop_loss <= 0:
            raise ValueError("Stop loss must be positive")
        if entry == stop_loss:
            raise ValueError("Entry and stop loss cannot be equal")

        risk_amount = capital * (risk_tolerance_pct / 100)
        risk_per_unit = abs(entry - stop_loss)
        suggested_size = risk_amount / risk_per_unit

        return PositionSizeResponse(
            symbol=asset.symbol,
            entry=entry,
            stop_loss=stop_loss,
            capital=capital,
            risk_tolerance_pct=risk_tolerance_pct,
            risk_amount=round(risk_amount, 2),
            risk_per_unit=round(risk_per_unit, 6),
            suggested_size=round(suggested_size, 4),
            max_loss=round(risk_amount, 2),
            note=(
                f"Fixed {risk_tolerance_pct}% risk model: risking ${risk_amount:.2f} "
                f"on {risk_per_unit:.4f} per-unit move."
            ),
        )

    def get_user_summary(self, user: User, db: Session) -> UserRiskSummary:
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

        trades_today = (
            db.query(func.count(Trade.id))
            .filter(Trade.user_id == user.id, Trade.created_at >= today_start)
            .scalar()
            or 0
        )

        open_trades = (
            db.query(func.count(Trade.id))
            .filter(Trade.user_id == user.id, Trade.status == "open")
            .scalar()
            or 0
        )

        closed_trades = (
            db.query(func.count(Trade.id))
            .filter(Trade.user_id == user.id, Trade.status == "closed")
            .scalar()
            or 0
        )

        closed_rows = (
            db.query(Trade)
            .filter(Trade.user_id == user.id, Trade.status == "closed")
            .order_by(Trade.created_at.asc())
            .all()
        )

        total_pnl = 0.0
        equity_curve = [user.capital]
        for trade in closed_rows:
            if trade.entry_price and trade.exit_price and trade.size:
                trade_type = (trade.type or "").upper()
                if trade_type == "BUY":
                    pnl = (trade.exit_price - trade.entry_price) * trade.size
                else:
                    pnl = (trade.entry_price - trade.exit_price) * trade.size
                total_pnl += pnl
                equity_curve.append(equity_curve[-1] + pnl)

        peak_equity = max(equity_curve) if equity_curve else user.capital
        current_equity = equity_curve[-1] if equity_curve else user.capital
        drawdown_pct = 0.0
        if peak_equity > 0:
            drawdown_pct = max(0.0, ((peak_equity - current_equity) / peak_equity) * 100)

        overtrading = trades_today >= MAX_DAILY_TRADES
        alerts: list[RiskAlert] = []

        if overtrading:
            alerts.append(
                RiskAlert(
                    type="overtrading",
                    severity="high",
                    message=f"You have placed {trades_today} trades today (limit: {MAX_DAILY_TRADES}). Consider pausing.",
                )
            )
        elif trades_today >= MAX_DAILY_TRADES - 1:
            alerts.append(
                RiskAlert(
                    type="overtrading",
                    severity="medium",
                    message=f"Approaching daily trade limit ({trades_today}/{MAX_DAILY_TRADES}).",
                )
            )

        if drawdown_pct >= DRAWDOWN_WARNING_PCT:
            alerts.append(
                RiskAlert(
                    type="drawdown",
                    severity="high",
                    message=f"Drawdown at {drawdown_pct:.1f}% from peak equity. Review your strategy.",
                )
            )
        elif drawdown_pct >= DRAWDOWN_WARNING_PCT / 2:
            alerts.append(
                RiskAlert(
                    type="drawdown",
                    severity="medium",
                    message=f"Drawdown at {drawdown_pct:.1f}%. Monitor risk exposure.",
                )
            )

        if open_trades >= 5:
            alerts.append(
                RiskAlert(
                    type="exposure",
                    severity="medium",
                    message=f"{open_trades} open positions. High concurrent exposure.",
                )
            )

        return UserRiskSummary(
            user_id=str(user.id),
            capital=user.capital,
            risk_tolerance_pct=user.risk_tolerance,
            trades_today=trades_today,
            max_daily_trades=MAX_DAILY_TRADES,
            overtrading=overtrading,
            open_trades=open_trades,
            closed_trades=closed_trades,
            total_pnl=round(total_pnl, 2),
            drawdown_pct=round(drawdown_pct, 2),
            peak_equity=round(peak_equity, 2),
            current_equity=round(current_equity, 2),
            alerts=alerts,
        )


risk_manager = RiskManager()
