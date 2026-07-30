"""
Polygon.io provider — real US stock prices.
Free tier: 5 requests/minute, unlimited daily.
"""
from datetime import datetime, timedelta, timezone

import httpx

from app.core.config import settings
from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

BASE = "https://api.polygon.io"


class PolygonProvider:

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        if not settings.polygon_api_key:
            raise ValueError("Polygon API key not configured")

        async with httpx.AsyncClient(timeout=10.0) as client:
            # Previous close endpoint (most reliable on free tier)
            r = await client.get(
                f"{BASE}/v2/aggs/ticker/{asset.symbol}/prev",
                params={"adjusted": "true", "apiKey": settings.polygon_api_key},
            )
            r.raise_for_status()
            data = r.json()

        results = data.get("results", [])
        if not results:
            raise ValueError(f"No data for {asset.symbol}")

        bar = results[0]
        price = float(bar["c"])   # close
        open_p = float(bar["o"])  # open
        change = round(price - open_p, 4)
        change_pct = round(((price - open_p) / open_p * 100) if open_p else 0, 2)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_pct,
            timestamp=datetime.now(timezone.utc),
            source="polygon",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        if not settings.polygon_api_key:
            raise ValueError("Polygon API key not configured")

        now = datetime.now(timezone.utc)
        range_map = {
            HistoryRange.d1: (now - timedelta(days=1),   "minute", 60),
            HistoryRange.w1: (now - timedelta(weeks=1),  "day",    1),
            HistoryRange.m1: (now - timedelta(days=30),  "day",    1),
            HistoryRange.y1: (now - timedelta(days=365), "week",   1),
        }
        from_dt, timespan, multiplier = range_map[history_range]

        from_str = from_dt.strftime("%Y-%m-%d")
        to_str   = now.strftime("%Y-%m-%d")

        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                f"{BASE}/v2/aggs/ticker/{asset.symbol}/range/{multiplier}/{timespan}/{from_str}/{to_str}",
                params={"adjusted": "true", "sort": "asc", "limit": 200,
                        "apiKey": settings.polygon_api_key},
            )
            r.raise_for_status()
            data = r.json()

        bars: list[OHLCVBar] = []
        for row in data.get("results", []):
            ts = datetime.fromtimestamp(row["t"] / 1000, tz=timezone.utc)
            bars.append(OHLCVBar(
                timestamp=ts,
                open=float(row["o"]),
                high=float(row["h"]),
                low=float(row["l"]),
                close=float(row["c"]),
                volume=float(row.get("v", 0)),
            ))
        return bars


polygon_provider = PolygonProvider()
