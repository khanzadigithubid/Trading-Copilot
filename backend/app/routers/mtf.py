from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.asset import HistoryRange
from app.schemas.mtf import MTFSignalResponse, TimeframeSignal
from app.schemas.signal import RiskLevel, SignalAction
from app.services.claude_client import generate_ai_signal
from app.services.indicators import calculate_indicators, summarize_price_action
from app.services.market_data import aggregator
from app.services.market_data.catalog import get_asset

router = APIRouter(prefix="/signals", tags=["signals"])

_TIMEFRAMES: list[tuple[HistoryRange, str, str]] = [
    (HistoryRange.d1, "1d", "Short-term (1D)"),
    (HistoryRange.w1, "1w", "Mid-term (1W)"),
    (HistoryRange.m1, "1m", "Long-term (1M)"),
]


@router.get("/{symbol}/mtf", response_model=MTFSignalResponse)
async def get_mtf_signal(
    symbol: str,
    db: Session = Depends(get_db),
):
    asset_def = get_asset(symbol)
    if asset_def is None:
        raise HTTPException(status_code=404, detail=f"Unknown asset: {symbol}")

    price_data = await aggregator.get_price(symbol)
    tf_signals: list[TimeframeSignal] = []

    for history_range, tf_id, tf_label in _TIMEFRAMES:
        try:
            history = await aggregator.get_history(symbol, history_range)
            indicators = calculate_indicators(history.bars)
            if indicators is None:
                continue
            price_action = summarize_price_action(history.bars)
            result = await generate_ai_signal(
                symbol=symbol.upper(),
                price=price_data.price,
                indicators=indicators,
                sentiment_summary="No sentiment data.",
                price_action_summary=price_action,
            )
            tf_signals.append(
                TimeframeSignal(
                    timeframe=tf_id,
                    label=tf_label,
                    signal=result["signal"],
                    confidence=round(result["confidence"], 1),
                    reasoning=result["reasoning"],
                    indicators=indicators,
                )
            )
        except Exception:
            continue

    if not tf_signals:
        raise HTTPException(status_code=422, detail="Not enough data for multi-timeframe analysis")

    # Weighted combination: 1D=1x, 1W=2x, 1M=3x (longer = more weight)
    weights = {"1d": 1, "1w": 2, "1m": 3}
    score_map = {SignalAction.buy: 1, SignalAction.hold: 0, SignalAction.sell: -1}

    total_weight = sum(weights.get(s.timeframe, 1) for s in tf_signals)
    weighted_score = sum(
        score_map[s.signal] * weights.get(s.timeframe, 1) for s in tf_signals
    )
    weighted_confidence = sum(
        s.confidence * weights.get(s.timeframe, 1) for s in tf_signals
    ) / total_weight

    norm_score = weighted_score / total_weight
    if norm_score >= 0.4:
        combined = SignalAction.buy
    elif norm_score <= -0.4:
        combined = SignalAction.sell
    else:
        combined = SignalAction.hold

    agreement = len({s.signal for s in tf_signals}) == 1

    # Risk level from confidence + agreement
    if weighted_confidence >= 70 and agreement:
        risk = RiskLevel.low
    elif weighted_confidence >= 50:
        risk = RiskLevel.medium
    else:
        risk = RiskLevel.high

    directions = {"buy": "bullish", "sell": "bearish", "hold": "neutral"}
    tf_summary = ", ".join(f"{s.label}: {s.signal.value}" for s in tf_signals)
    combined_reasoning = (
        f"Multi-timeframe analysis ({tf_summary}). "
        f"{'All timeframes agree' if agreement else 'Timeframes diverge'} — "
        f"combined signal is {combined.value} with {round(weighted_confidence, 1)}% confidence. "
        f"Overall market is {directions.get(combined.value, 'neutral')}."
    )

    return MTFSignalResponse(
        symbol=symbol.upper(),
        combined_signal=combined,
        combined_confidence=round(weighted_confidence, 1),
        combined_reasoning=combined_reasoning,
        risk_level=risk,
        agreement=agreement,
        timeframes=tf_signals,
        source=tf_signals[0].timeframe if tf_signals else "rules",
    )
