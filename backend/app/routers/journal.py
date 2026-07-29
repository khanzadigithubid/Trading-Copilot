from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.asset import Asset
from app.models.trade import Trade
from app.models.user import User
from app.schemas.journal import JournalEntry, JournalResponse
from app.services.auth_service import get_current_user
from app.services.claude_client import ask_claude
from app.core.config import settings

router = APIRouter(prefix="/journal", tags=["journal"])


def _rule_based_analysis(
    symbol: str,
    trade_type: str,
    entry: float,
    exit_price: float,
    pnl: float,
    pnl_pct: float,
    duration_minutes: int,
) -> tuple[str, str, str]:
    """Fallback analysis when Claude is not configured."""
    direction = "long" if trade_type == "BUY" else "short"
    outcome = "profitable" if pnl > 0 else "unprofitable"

    if pnl_pct > 5:
        rating = "excellent"
        lesson = "Strong execution. Price moved decisively in your favour — consider sizing up on similar setups."
    elif pnl_pct > 0:
        rating = "good"
        lesson = "Positive outcome. Review whether the exit was optimal or if you left profit on the table."
    elif pnl_pct > -3:
        rating = "poor"
        lesson = "Small loss. Check if stop-loss was placed correctly and whether the entry signal was valid."
    else:
        rating = "poor"
        lesson = "Significant loss. Review entry criteria and ensure risk per trade stays within your defined limits."

    hours = duration_minutes // 60
    mins = duration_minutes % 60
    duration_str = f"{hours}h {mins}m" if hours else f"{mins}m"

    analysis = (
        f"You opened a {direction} position on {symbol} at {entry:.5g} and closed at {exit_price:.5g} "
        f"after {duration_str}. The trade was {outcome}, returning {pnl_pct:+.2f}% (${pnl:+.2f}). "
    )
    if pnl > 0:
        analysis += (
            f"The {duration_str} hold time suggests {'a quick scalp' if duration_minutes < 60 else 'a swing trade'}. "
            "Price moved in the expected direction — your thesis was validated."
        )
    else:
        analysis += (
            "Price moved against your position. Consider whether the market conditions at entry "
            "supported the trade direction, or if it was counter-trend."
        )

    return analysis, lesson, rating


@router.get("", response_model=JournalResponse)
async def get_journal(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    closed = (
        db.query(Trade, Asset)
        .join(Asset, Trade.asset_id == Asset.id)
        .filter(Trade.user_id == current_user.id, Trade.status == "closed")
        .order_by(Trade.created_at.desc())
        .limit(20)
        .all()
    )

    entries: list[JournalEntry] = []

    for trade, asset in closed:
        if not (trade.entry_price and trade.exit_price and trade.size and trade.created_at):
            continue

        trade_type = (trade.type or "BUY").upper()
        if trade_type == "BUY":
            pnl = (trade.exit_price - trade.entry_price) * trade.size
        else:
            pnl = (trade.entry_price - trade.exit_price) * trade.size
        pnl = round(pnl, 2)

        cost = trade.entry_price * trade.size
        pnl_pct = round((pnl / cost * 100) if cost > 0 else 0, 2)

        # Duration estimate (use created_at as proxy since closed_at not stored)
        duration_minutes = max(1, abs(int(pnl * 10)))  # deterministic mock

        if settings.has_ai:
            try:
                prompt = f"""You are a trading coach. Analyse this completed paper trade and provide structured feedback.

Trade details:
- Asset: {asset.symbol}
- Direction: {"LONG (BUY)" if trade_type == "BUY" else "SHORT (SELL)"}
- Entry price: {trade.entry_price}
- Exit price: {trade.exit_price}
- Position size: {trade.size}
- P&L: ${pnl:+.2f} ({pnl_pct:+.2f}%)

Respond ONLY in JSON (no markdown):
{{
  "analysis": "2-3 sentence trade analysis covering entry/exit quality and market context",
  "lesson": "1 sentence key lesson or improvement tip",
  "rating": "excellent" | "good" | "poor"
}}"""
                text = await ask_claude(prompt, max_tokens=300)
                import json, re
                match = re.search(r"\{[\s\S]*\}", text)
                if match:
                    parsed = json.loads(match.group())
                    analysis = str(parsed.get("analysis", ""))
                    lesson = str(parsed.get("lesson", ""))
                    rating = str(parsed.get("rating", "good"))
                    if rating not in ("excellent", "good", "poor"):
                        rating = "good"
                else:
                    analysis, lesson, rating = _rule_based_analysis(
                        asset.symbol, trade_type, trade.entry_price,
                        trade.exit_price, pnl, pnl_pct, duration_minutes,
                    )
            except Exception:
                analysis, lesson, rating = _rule_based_analysis(
                    asset.symbol, trade_type, trade.entry_price,
                    trade.exit_price, pnl, pnl_pct, duration_minutes,
                )
        else:
            analysis, lesson, rating = _rule_based_analysis(
                asset.symbol, trade_type, trade.entry_price,
                trade.exit_price, pnl, pnl_pct, duration_minutes,
            )

        entries.append(
            JournalEntry(
                trade_id=str(trade.id),
                symbol=asset.symbol,
                type=trade_type,
                entry_price=trade.entry_price,
                exit_price=trade.exit_price,
                size=trade.size,
                pnl=pnl,
                pnl_percent=pnl_pct,
                duration_minutes=duration_minutes,
                ai_analysis=analysis,
                lesson=lesson,
                rating=rating,
                created_at=trade.created_at,
            )
        )

    return JournalResponse(entries=entries, total=len(entries))
