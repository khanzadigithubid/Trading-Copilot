"""
AI News Impact Analyzer — analyzes how a news event affects different markets.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.services.claude_client import ask_claude
from app.services.market_data import aggregator
from app.models.user import User

router = APIRouter(prefix="/news-impact", tags=["news_impact"])


class NewsImpactRequest(BaseModel):
    headline: str = Field(min_length=5, max_length=500)


class AssetImpact(BaseModel):
    symbol: str
    name: str
    impact: str       # bullish / bearish / neutral
    reason: str
    magnitude: str    # high / medium / low


class NewsImpactResponse(BaseModel):
    headline: str
    summary: str
    immediate_impact: str
    timeframe: str
    assets: list[AssetImpact]
    trading_tip: str


@router.post("", response_model=NewsImpactResponse)
async def analyze_news_impact(
    payload: NewsImpactRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    headline = payload.headline

    # Get current prices for context
    price_context = ""
    try:
        for sym in ["BTCUSDT", "XAUUSD", "EURUSD", "AAPL", "USOIL"]:
            p = await aggregator.get_price(sym)
            price_context += f"{sym}: ${p.price:,.2f}\n"
    except Exception:
        pass

    from app.core.config import settings

    if settings.has_ai:
        try:
            prompt = f"""You are a financial market analyst. Analyze how this news headline affects financial markets.

News: "{headline}"

Current prices:
{price_context}

Respond ONLY in this exact JSON format (no markdown):
{{
  "summary": "2 sentence explanation of what this news means",
  "immediate_impact": "What will likely happen in next 1-24 hours",
  "timeframe": "short-term (hours) / medium-term (days) / long-term (weeks)",
  "assets": [
    {{"symbol": "BTCUSDT", "name": "Bitcoin", "impact": "bullish/bearish/neutral", "reason": "one sentence why", "magnitude": "high/medium/low"}},
    {{"symbol": "XAUUSD", "name": "Gold", "impact": "bullish/bearish/neutral", "reason": "one sentence why", "magnitude": "high/medium/low"}},
    {{"symbol": "EURUSD", "name": "EUR/USD", "impact": "bullish/bearish/neutral", "reason": "one sentence why", "magnitude": "high/medium/low"}},
    {{"symbol": "AAPL", "name": "Apple", "impact": "bullish/bearish/neutral", "reason": "one sentence why", "magnitude": "high/medium/low"}},
    {{"symbol": "USOIL", "name": "Crude Oil", "impact": "bullish/bearish/neutral", "reason": "one sentence why", "magnitude": "high/medium/low"}}
  ],
  "trading_tip": "One specific actionable tip for traders right now"
}}"""

            import json, re
            text = await ask_claude(prompt, max_tokens=600)
            match = re.search(r"\{[\s\S]*\}", text)
            if match:
                data = json.loads(match.group())
                return NewsImpactResponse(
                    headline=headline,
                    summary=data.get("summary", ""),
                    immediate_impact=data.get("immediate_impact", ""),
                    timeframe=data.get("timeframe", "short-term"),
                    assets=[AssetImpact(**a) for a in data.get("assets", [])],
                    trading_tip=data.get("trading_tip", ""),
                )
        except Exception:
            pass

    # Rule-based fallback
    lower = headline.lower()
    is_bullish = any(w in lower for w in ["surge", "rally", "gain", "rise", "record", "high", "growth", "profit"])
    is_bearish = any(w in lower for w in ["crash", "fall", "drop", "fear", "risk", "war", "recession", "loss"])

    default_impact = "bullish" if is_bullish else "bearish" if is_bearish else "neutral"

    return NewsImpactResponse(
        headline=headline,
        summary=f"This news appears {'positive' if is_bullish else 'negative' if is_bearish else 'neutral'} for markets overall.",
        immediate_impact="Monitor price action over the next few hours.",
        timeframe="short-term",
        assets=[
            AssetImpact(symbol="BTCUSDT", name="Bitcoin", impact=default_impact, reason="General market sentiment affected", magnitude="medium"),
            AssetImpact(symbol="XAUUSD", name="Gold", impact="bullish" if is_bearish else "neutral", reason="Safe haven demand", magnitude="medium"),
            AssetImpact(symbol="EURUSD", name="EUR/USD", impact=default_impact, reason="USD demand shift", magnitude="low"),
            AssetImpact(symbol="AAPL", name="Apple", impact=default_impact, reason="General equity sentiment", magnitude="low"),
            AssetImpact(symbol="USOIL", name="Crude Oil", impact=default_impact, reason="Economic activity expectations", magnitude="medium"),
        ],
        trading_tip="Wait for price confirmation before entering. Avoid trading immediately after major news.",
    )
