"""
AI Trade Planner — generates complete trade plan with entry/exit/risk.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.asset import HistoryRange
from app.services.auth_service import get_current_user
from app.services.claude_client import ask_claude
from app.services.indicators import calculate_indicators, summarize_price_action
from app.services.market_data import aggregator
from app.models.user import User

router = APIRouter(prefix="/trade-planner", tags=["trade_planner"])


class TradePlanRequest(BaseModel):
    symbol: str
    direction: str = Field(default="auto", pattern="^(auto|BUY|SELL)$")
    capital: float = Field(default=1000.0, gt=0)
    risk_percent: float = Field(default=2.0, gt=0, le=10)


class TradePlan(BaseModel):
    symbol: str
    direction: str
    current_price: float
    entry_zone_low: float
    entry_zone_high: float
    stop_loss: float
    take_profit_1: float
    take_profit_2: float
    take_profit_3: float
    position_size: float
    risk_amount: float
    potential_profit_1: float
    risk_reward: float
    reasoning: str
    entry_timing: str
    key_levels: str
    warning: str
    confidence: int


@router.post("", response_model=TradePlan)
async def get_trade_plan(
    payload: TradePlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    price_data = await aggregator.get_price(payload.symbol)
    history = await aggregator.get_history(payload.symbol, HistoryRange.m1)
    indicators = calculate_indicators(history.bars)
    price_action = summarize_price_action(history.bars)

    current_price = price_data.price
    rsi = indicators.rsi if indicators else 50
    ma50 = indicators.ma50 if indicators else current_price
    ma200 = indicators.ma200 if indicators else current_price

    # Determine direction
    direction = payload.direction
    if direction == "auto":
        if rsi and rsi < 40:
            direction = "BUY"
        elif rsi and rsi > 60:
            direction = "SELL"
        else:
            direction = "BUY" if current_price > (ma50 or current_price) else "SELL"

    # Calculate levels
    atr_pct = 0.02  # 2% default ATR estimate
    if history.bars and len(history.bars) >= 5:
        recent = history.bars[-5:]
        highs = [b.high for b in recent]
        lows = [b.low for b in recent]
        atr_pct = (max(highs) - min(lows)) / current_price

    if direction == "BUY":
        entry_low = round(current_price * (1 - atr_pct * 0.3), 4)
        entry_high = round(current_price * (1 + atr_pct * 0.1), 4)
        stop_loss = round(current_price * (1 - atr_pct * 1.5), 4)
        tp1 = round(current_price * (1 + atr_pct * 1.0), 4)
        tp2 = round(current_price * (1 + atr_pct * 2.0), 4)
        tp3 = round(current_price * (1 + atr_pct * 3.0), 4)
    else:
        entry_low = round(current_price * (1 - atr_pct * 0.1), 4)
        entry_high = round(current_price * (1 + atr_pct * 0.3), 4)
        stop_loss = round(current_price * (1 + atr_pct * 1.5), 4)
        tp1 = round(current_price * (1 - atr_pct * 1.0), 4)
        tp2 = round(current_price * (1 - atr_pct * 2.0), 4)
        tp3 = round(current_price * (1 - atr_pct * 3.0), 4)

    risk_per_unit = abs(current_price - stop_loss)
    risk_amount = round(payload.capital * payload.risk_percent / 100, 2)
    position_size = round(risk_amount / risk_per_unit, 6) if risk_per_unit > 0 else 0.01
    profit_1 = round(risk_amount * (abs(tp1 - current_price) / risk_per_unit), 2) if risk_per_unit > 0 else risk_amount
    rr = round(abs(tp1 - current_price) / risk_per_unit, 1) if risk_per_unit > 0 else 1.5

    reasoning = f"RSI at {rsi:.1f}" if rsi else "Technical analysis"
    entry_timing = "Wait for price to enter the entry zone before executing."
    key_levels = f"MA50: {ma50:.4f} | MA200: {ma200:.4f}" if ma50 and ma200 else "Check chart for support/resistance"
    warning = "This is educational only. Not financial advice. Always use stop loss."
    confidence = 65

    # AI enhancement
    from app.core.config import settings
    if settings.has_ai and indicators:
        try:
            prompt = f"""You are a professional trader. Create a concise trade plan.

Asset: {payload.symbol}
Price: ${current_price:,.4f}
Direction: {direction}
RSI: {rsi:.1f if rsi else 'N/A'}
MA50: {ma50:.4f if ma50 else 'N/A'}
Price action: {price_action}

Respond in this exact format:
REASONING: [Why this trade makes sense in 2 sentences]
TIMING: [When exactly to enter — what to wait for]
LEVELS: [Key support/resistance levels to watch]
WARNING: [Main risk to this trade]
CONFIDENCE: [50-90 number only]"""

            text = await ask_claude(prompt, max_tokens=300)
            for line in text.strip().split("\n"):
                if line.startswith("REASONING:"):
                    reasoning = line.replace("REASONING:", "").strip()
                elif line.startswith("TIMING:"):
                    entry_timing = line.replace("TIMING:", "").strip()
                elif line.startswith("LEVELS:"):
                    key_levels = line.replace("LEVELS:", "").strip()
                elif line.startswith("WARNING:"):
                    warning = line.replace("WARNING:", "").strip()
                elif line.startswith("CONFIDENCE:"):
                    try:
                        confidence = int(line.replace("CONFIDENCE:", "").strip().split()[0])
                    except Exception:
                        pass
        except Exception:
            pass

    return TradePlan(
        symbol=payload.symbol,
        direction=direction,
        current_price=current_price,
        entry_zone_low=entry_low,
        entry_zone_high=entry_high,
        stop_loss=stop_loss,
        take_profit_1=tp1,
        take_profit_2=tp2,
        take_profit_3=tp3,
        position_size=position_size,
        risk_amount=risk_amount,
        potential_profit_1=profit_1,
        risk_reward=rr,
        reasoning=reasoning,
        entry_timing=entry_timing,
        key_levels=key_levels,
        warning=warning,
        confidence=confidence,
    )
