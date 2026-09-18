"""
Alpaca Markets provider — free paper-trading API key.
Covers US stocks, ETFs, and crypto with real-time data.
Sign up free: https://alpaca.markets

Set in .env:
  ALPACA_API_KEY=PKxxxx
  ALPACA_SECRET_KEY=xxxx
  ALPACA_BASE_URL=https://paper-api.alpaca.markets   # paper trading
"""
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

# Alpaca data API (separate from broker API)
_DATA_URL = "https://data.alpaca.markets/v2"
_DATA_URL_CRYPTO = "https://data.alpaca.markets/v1beta3"

# Symbols that Alpaca tracks as crypto (use crypto endpoint)
_ALPACA_CRYPTO = {
    "BTCUSDT", "ETHUSDT", "SOLUSDT", "LTCUSDT", "BCHUSD",
    "UNIUSDT", "LINKUSDT", "AAVEUSD", "DOGEUSD",
}

# Timeframe map for Alpaca
_TF_MAP = {
    HistoryRange.d1: ("1Hour",  24),
    HistoryRange.w1: ("1Day",   7),
    HistoryRange.m1: ("1Day",  30),
    HistoryRange.y1: ("1Week", 52),
}


def _headers() -> dict[str, str]:
    return {
        "APCA-API-KEY-ID":     settings.alpaca_api_key,
        "APCA-API-SECRET-KEY": settings.alpaca_secret_key,
    }


def _alpaca_symbol(asset: AssetDefinition) -> str:
    """Convert our symbol to Alpaca format."""
    sym = asset.provider_symbol or asset.symbol
    # Alpaca uses AAPL, MSFT directly for stocks
    # For crypto Alpaca uses BTC/USD style
    crypto_map = {
        "BTCUSDT": "BTC/USD",
        "ETHUSDT": "ETH/USD",
        "SOLUSDT": "SOL/USD",
        "LTCUSDT": "LTC/USD",
        "DOGEUSD": "DOGE/USD",
        "UNIUSDT": "UNI/USD",
        "LINKUSDT": "LINK/USD",
    }
    return crypto_map.get(sym, sym)


class AlpacaProvider:
    """Fetches live prices and OHLCV history from Alpaca Data API (free tier)."""

    def _is_available(self) -> bool:
        return bool(settings.alpaca_api_key and settings.alpaca_secret_key)

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        if not self._is_available():
            raise ValueError("Alpaca API key not configured")

        sym = _alpaca_symbol(asset)
        headers = _headers()

        async with httpx.AsyncClient(timeout=10.0) as client:
            if asset.symbol in _ALPACA_CRYPTO:
                url = f"{_DATA_URL_CRYPTO}/crypto/us/latest/trades"
                r = await client.get(url, headers=headers, params={"symbols": sym})
            else:
                url = f"{_DATA_URL}/stocks/{sym}/trades/latest"
                r = await client.get(url, headers=headers)

            r.raise_for_status()
            data = r.json()

        # Parse price from response
        if asset.symbol in _ALPACA_CRYPTO:
            trade = data.get("trades", {}).get(sym, {})
        else:
            trade = data.get("trade", {})

        price = float(trade.get("p", 0))
        if not price:
            raise ValueError(f"Alpaca: no price data for {sym}")

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=None,
            change_percent=None,
            timestamp=datetime.now(timezone.utc),
            source="alpaca",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        if not self._is_available():
            raise ValueError("Alpaca API key not configured")

        sym = _alpaca_symbol(asset)
        timeframe, limit = _TF_MAP[history_range]
        headers = _headers()

        async with httpx.AsyncClient(timeout=15.0) as client:
            if asset.symbol in _ALPACA_CRYPTO:
                url = f"{_DATA_URL_CRYPTO}/crypto/us/bars"
                params = {"symbols": sym, "timeframe": timeframe, "limit": limit}
                r = await client.get(url, headers=headers, params=params)
                r.raise_for_status()
                raw_bars = r.json().get("bars", {}).get(sym, [])
            else:
                url = f"{_DATA_URL}/stocks/{sym}/bars"
                params = {"timeframe": timeframe, "limit": limit, "adjustment": "raw"}
                r = await client.get(url, headers=headers, params=params)
                r.raise_for_status()
                raw_bars = r.json().get("bars", [])

        bars: list[OHLCVBar] = []
        for b in raw_bars:
            try:
                bars.append(OHLCVBar(
                    timestamp=datetime.fromisoformat(b["t"].replace("Z", "+00:00")),
                    open=float(b["o"]),
                    high=float(b["h"]),
                    low=float(b["l"]),
                    close=float(b["c"]),
                    volume=float(b.get("v", 0)),
                ))
            except (KeyError, TypeError, ValueError):
                continue

        return sorted(bars, key=lambda x: x.timestamp)


alpaca_provider = AlpacaProvider()
