"""
News feed endpoint.
Uses NewsAPI if configured, otherwise returns curated mock headlines.
"""
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Query

from app.core.config import settings

router = APIRouter(prefix="/news", tags=["news"])

_MOCK_NEWS = [
    {"title": "Bitcoin surges past key resistance as institutional demand grows", "symbol": "BTCUSDT", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Federal Reserve signals rate pause — Dollar weakens against majors", "symbol": "EURUSD", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Gold hits record high amid geopolitical uncertainty", "symbol": "XAUUSD", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "NVIDIA reports record AI chip revenue, stock rises 8%", "symbol": "NVDA", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Oil prices drop as OPEC+ considers output increase", "symbol": "USOIL", "sentiment": "bearish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Ethereum ETF approval boosts crypto market sentiment", "symbol": "ETHUSDT", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Apple announces record buyback program — shares rally", "symbol": "AAPL", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Yen weakens as Bank of Japan maintains ultra-loose policy", "symbol": "USDJPY", "sentiment": "bearish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Tesla delivery numbers beat expectations for Q3", "symbol": "TSLA", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Solana network upgrades boost transaction speed to new record", "symbol": "SOLUSDT", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "Silver demand surges on solar panel manufacturing boom", "symbol": "XAGUSD", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
    {"title": "S&P 500 hits new all-time high as earnings season impresses", "symbol": "SPY", "sentiment": "bullish", "source": "Mock News", "url": "#", "published_at": datetime.now(timezone.utc).isoformat()},
]

_SYMBOL_KEYWORDS = {
    "BTCUSDT": "Bitcoin BTC", "ETHUSDT": "Ethereum ETH", "SOLUSDT": "Solana SOL",
    "BNBUSDT": "BNB Binance", "XRPUSDT": "XRP Ripple", "ADAUSDT": "Cardano ADA",
    "DOGEUSDT": "Dogecoin DOGE", "EURUSD": "EUR USD Euro Dollar",
    "GBPUSD": "GBP Pound Sterling", "USDJPY": "JPY Yen Japan",
    "XAUUSD": "Gold XAU", "XAGUSD": "Silver XAG", "USOIL": "Crude Oil WTI",
    "AAPL": "Apple AAPL", "MSFT": "Microsoft MSFT", "TSLA": "Tesla TSLA",
    "NVDA": "NVIDIA NVDA", "GOOGL": "Google Alphabet GOOGL",
    "AMZN": "Amazon AMZN", "META": "Meta Facebook META",
    "SPY": "S&P 500 SPY", "QQQ": "NASDAQ QQQ", "DIA": "Dow Jones DIA",
}


@router.get("")
async def get_news(symbol: str | None = Query(default=None)):
    """Return news headlines — real from NewsAPI or mock if not configured."""
    if settings.news_api_key:
        try:
            query = _SYMBOL_KEYWORDS.get(symbol.upper() if symbol else "", "financial markets trading")
            async with httpx.AsyncClient(timeout=8.0) as client:
                r = await client.get(
                    "https://newsapi.org/v2/everything",
                    params={"q": query, "sortBy": "publishedAt", "pageSize": 15,
                            "language": "en", "apiKey": settings.news_api_key},
                )
                r.raise_for_status()
                articles = r.json().get("articles", [])
                return {"articles": [
                    {"title": a.get("title", ""), "symbol": symbol or "MARKET",
                     "sentiment": "neutral", "source": a.get("source", {}).get("name", ""),
                     "url": a.get("url", "#"),
                     "published_at": a.get("publishedAt", datetime.now(timezone.utc).isoformat()),
                     "description": a.get("description", "")[:200]}
                    for a in articles if a.get("title")
                ], "source": "newsapi"}
        except Exception:
            pass

    # Fallback to mock
    filtered = [n for n in _MOCK_NEWS if not symbol or n["symbol"] == symbol.upper()] if symbol else _MOCK_NEWS
    return {"articles": filtered, "source": "mock"}
