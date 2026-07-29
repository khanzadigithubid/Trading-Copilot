"""
Sentiment heatmap endpoint.
Uses NewsAPI if configured, otherwise generates rule-based scores from
mock price-action data. All asset scoring runs concurrently with timeouts.
"""
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.asset import Asset
from app.models.sentiment_log import SentimentLog
from app.services.market_data.catalog import DEFAULT_ASSETS
from app.services.market_data.mock_provider import mock_provider
from app.schemas.asset import HistoryRange

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

_BULLISH = ["surge", "rally", "gain", "high", "record", "bull", "rise", "up",
            "growth", "profit", "positive", "boost", "strong", "buy", "upgrade"]
_BEARISH = ["crash", "fall", "drop", "low", "bear", "decline", "sell", "loss",
            "weak", "negative", "risk", "fear", "down", "downgrade", "concern"]


def _score_headline(text: str) -> float:
    low = text.lower()
    bull = sum(1 for w in _BULLISH if w in low)
    bear = sum(1 for w in _BEARISH if w in low)
    total = bull + bear
    if total == 0:
        return 0.0
    return round((bull - bear) / total, 3)


def _price_action_score(change_pct: float) -> float:
    if change_pct > 3:   return 0.8
    if change_pct > 1:   return 0.5
    if change_pct > 0:   return 0.2
    if change_pct > -1:  return -0.2
    if change_pct > -3:  return -0.5
    return -0.8


def _sentiment_label(score: float) -> str:
    if score >= 0.5:  return "Very Bullish"
    if score >= 0.2:  return "Bullish"
    if score >= -0.2: return "Neutral"
    if score >= -0.5: return "Bearish"
    return "Very Bearish"


def _sentiment_color(score: float) -> str:
    if score >= 0.5:  return "#059669"
    if score >= 0.2:  return "#10b981"
    if score >= -0.2: return "#64748b"
    if score >= -0.5: return "#ef4444"
    return "#dc2626"


async def _fetch_news_scores(asset_name: str) -> list[tuple[str, float]]:
    if not settings.news_api_key:
        return []
    query = asset_name.split("/")[0].strip()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "sortBy": "publishedAt",
                    "pageSize": 5,
                    "language": "en",
                    "apiKey": settings.news_api_key,
                },
            )
            r.raise_for_status()
            articles = r.json().get("articles", [])
    except Exception:
        return []

    results: list[tuple[str, float]] = []
    for article in articles[:5]:
        title = (article.get("title") or "")
        desc  = (article.get("description") or "")
        score = _score_headline(f"{title} {desc}")
        results.append((title[:120], score))
    return results


@router.get("")
async def get_sentiment_heatmap(db: Session = Depends(get_db)):
    """Return sentiment scores for all assets — fast, uses mock data + cache."""
    import asyncio

    cutoff = datetime.now(timezone.utc) - timedelta(hours=2)

    async def _score_one(asset_def) -> dict:
        symbol = asset_def.symbol
        name   = asset_def.name
        mtype  = asset_def.market_type.value

        # 1. Check DB cache — return immediately if fresh
        db_asset = db.query(Asset).filter(Asset.symbol == symbol).first()
        if db_asset:
            cached = (
                db.query(SentimentLog)
                .filter(
                    SentimentLog.asset_id == db_asset.id,
                    SentimentLog.created_at >= cutoff,
                )
                .order_by(SentimentLog.created_at.desc())
                .first()
            )
            if cached and cached.sentiment_score is not None:
                return {
                    "symbol": symbol, "market_type": mtype, "name": name,
                    "score": cached.sentiment_score,
                    "label": _sentiment_label(cached.sentiment_score),
                    "color": _sentiment_color(cached.sentiment_score),
                    "headline": cached.headline or "",
                    "source": "cached",
                }

        # 2. Use mock provider (always fast — no external HTTP)
        score    = 0.0
        headline = ""
        source   = "price_action"
        try:
            bars = await mock_provider.get_history(asset_def, HistoryRange.d1)
            if bars and len(bars) >= 2:
                fc = bars[0].close
                lc = bars[-1].close
                change_pct = ((lc - fc) / fc * 100) if fc else 0
                score = _price_action_score(change_pct)
        except Exception:
            pass

        # 3. Optionally enrich with NewsAPI (only if key present, with short timeout)
        if settings.news_api_key:
            try:
                news = await asyncio.wait_for(_fetch_news_scores(name), timeout=4.0)
                if news:
                    news_avg  = sum(s for _, s in news) / len(news)
                    score     = round(score * 0.3 + news_avg * 0.7, 3)
                    headline  = news[0][0]
                    source    = "newsapi"
            except Exception:
                pass

        # 4. Persist score to cache
        if db_asset:
            db.add(SentimentLog(
                asset_id=db_asset.id,
                headline=headline or None,
                sentiment_score=score,
                summary=_sentiment_label(score),
            ))
            try:
                db.commit()
            except Exception:
                db.rollback()

        return {
            "symbol": symbol, "market_type": mtype, "name": name,
            "score": score,
            "label": _sentiment_label(score),
            "color": _sentiment_color(score),
            "headline": headline,
            "source": source,
        }

    # Run all 27 assets fully concurrently — mock provider is synchronous
    # so this completes in milliseconds
    tasks = [_score_one(a) for a in DEFAULT_ASSETS]
    done  = await asyncio.gather(*tasks, return_exceptions=True)

    results = [item for item in done if isinstance(item, dict)]
    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "assets": results,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
