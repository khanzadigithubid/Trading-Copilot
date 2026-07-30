"""
CoinGecko provider — free, no API key, works on all cloud servers.
Used as fallback when Binance is blocked (Render, Railway etc.)
"""
from datetime import datetime, timedelta, timezone

import httpx

from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

# Map our symbols to CoinGecko IDs
COINGECKO_IDS: dict[str, str] = {
    "BTCUSDT":  "bitcoin",
    "ETHUSDT":  "ethereum",
    "SOLUSDT":  "solana",
    "BNBUSDT":  "binancecoin",
    "XRPUSDT":  "ripple",
    "ADAUSDT":  "cardano",
    "DOGEUSDT": "dogecoin",
}


class CoinGeckoProvider:
    BASE = "https://api.coingecko.com/api/v3"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        coin_id = COINGECKO_IDS.get(asset.symbol)
        if not coin_id:
            raise ValueError(f"CoinGecko: unknown symbol {asset.symbol}")

        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"{self.BASE}/simple/price",
                params={
                    "ids": coin_id,
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_24hr_vol": "true",
                },
            )
            r.raise_for_status()
            data = r.json()[coin_id]

        price = float(data["usd"])
        change_pct = float(data.get("usd_24h_change", 0))
        change = round(price * change_pct / 100, 6)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=round(change, 6),
            change_percent=round(change_pct, 2),
            timestamp=datetime.now(timezone.utc),
            source="coingecko",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        coin_id = COINGECKO_IDS.get(asset.symbol)
        if not coin_id:
            raise ValueError(f"CoinGecko: unknown symbol {asset.symbol}")

        days_map = {
            HistoryRange.d1: 1,
            HistoryRange.w1: 7,
            HistoryRange.m1: 30,
            HistoryRange.y1: 365,
        }
        days = days_map[history_range]

        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                f"{self.BASE}/coins/{coin_id}/ohlc",
                params={"vs_currency": "usd", "days": str(days)},
            )
            r.raise_for_status()
            rows = r.json()  # [[timestamp_ms, open, high, low, close], ...]

        bars: list[OHLCVBar] = []
        for row in rows:
            ts = datetime.fromtimestamp(row[0] / 1000, tz=timezone.utc)
            bars.append(OHLCVBar(
                timestamp=ts,
                open=float(row[1]),
                high=float(row[2]),
                low=float(row[3]),
                close=float(row[4]),
                volume=None,
            ))
        return bars


coingecko_provider = CoinGeckoProvider()
