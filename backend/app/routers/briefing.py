"""
AI Daily Market Briefing — personalized morning report.
Fetches live prices + generates AI analysis for top assets.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.asset import HistoryRange
from app.services.auth_service import get_current_user
from app.services.claude_client import ask_claude, generate_ai_signal
from app.services.indicators import calculate_indicators, summarize_price_action
from app.services.market_data import aggregator
from app.models.user import User

router = APIRouter(prefix="/briefing", tags=["briefing"])

TOP_ASSETS = ["BTCUSDT", "XAUUSD", "EURUSD", "AAPL", "USOIL"]


class AssetBrief(BaseModel):
    symbol: str
    price: float
    change_percent: float
    signal: str
    sentiment: str    # bullish / bearish / neutral
    key_insight: str


class DailyBriefing(BaseModel):
    date: str
    greeting: str
    market_overview: str
    top_opportunity: str
    risk_warning: str
    assets: list[AssetBrief]
    generated_at: str


@router.get("", response_model=DailyBriefing)
async def get_daily_briefing(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    hour = now.hour
    if hour < 12:
        greeting = f"Good morning! Here's your market briefing for {now.strftime('%A, %B %d')}."
    elif hour < 17:
        greeting = f"Good afternoon! Here's the latest market update for {now.strftime('%A, %B %d')}."
    else:
        greeting = f"Good evening! Here's your end-of-day market summary for {now.strftime('%A, %B %d')}."

    asset_briefs = []
    market_lines = []

    for symbol in TOP_ASSETS:
        try:
            price_data = await aggregator.get_price(symbol)
            history = await aggregator.get_history(symbol, HistoryRange.d1)
            indicators = calculate_indicators(history.bars)
            price_action = summarize_price_action(history.bars)

            chg = price_data.change_percent or 0
            sentiment = "bullish" if chg > 0.5 else "bearish" if chg < -0.5 else "neutral"
            emoji = "🟢" if sentiment == "bullish" else "🔴" if sentiment == "bearish" else "⚪"

            if indicators:
                rsi = indicators.rsi or 50
                if rsi < 35:
                    insight = f"RSI oversold at {rsi:.1f} — potential bounce setup"
                elif rsi > 65:
                    insight = f"RSI overbought at {rsi:.1f} — watch for pullback"
                else:
                    insight = f"RSI neutral at {rsi:.1f}. {price_action[:80]}"
            else:
                insight = price_action[:100]

            market_lines.append(
                f"{emoji} {symbol}: ${price_data.price:,.2f} ({chg:+.1f}%) — {insight[:60]}"
            )

            signal_result = await generate_ai_signal(
                symbol, price_data.price, indicators,
                "No news available.", price_action
            ) if indicators else {"signal": type("S", (), {"value": "HOLD"})(), "confidence": 50}

            asset_briefs.append(AssetBrief(
                symbol=symbol,
                price=price_data.price,
                change_percent=round(chg, 2),
                signal=signal_result["signal"].value,
                sentiment=sentiment,
                key_insight=insight[:120],
            ))
        except Exception:
            continue

    # AI-generated overview
    market_summary = "\n".join(market_lines)
    overview = market_summary
    top_opportunity = "Check signals for individual assets."
    risk_warning = "Always use stop losses. Never risk more than 2% per trade."

    from app.core.config import settings
    if settings.has_ai and asset_briefs:
        try:
            prompt = f"""You are a professional market analyst. Write a concise daily briefing.

Current market data:
{market_summary}

Write in this exact format (keep each section SHORT — 1-2 sentences max):
OVERVIEW: [Overall market mood and key theme today]
OPPORTUNITY: [The single best setup/opportunity right now with specific asset and reason]
RISK: [Main risk to watch today]

Be specific, use the actual prices and percentages provided."""

            response = await ask_claude(prompt, max_tokens=300)
            lines = response.strip().split("\n")
            for line in lines:
                if line.startswith("OVERVIEW:"):
                    overview = line.replace("OVERVIEW:", "").strip()
                elif line.startswith("OPPORTUNITY:"):
                    top_opportunity = line.replace("OPPORTUNITY:", "").strip()
                elif line.startswith("RISK:"):
                    risk_warning = line.replace("RISK:", "").strip()
        except Exception:
            pass

    return DailyBriefing(
        date=now.strftime("%A, %B %d, %Y"),
        greeting=greeting,
        market_overview=overview,
        top_opportunity=top_opportunity,
        risk_warning=risk_warning,
        assets=asset_briefs,
        generated_at=now.isoformat(),
    )
