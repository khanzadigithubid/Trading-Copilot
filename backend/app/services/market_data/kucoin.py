"""
KuCoin provider — free, no API key, works on all cloud servers including Render.
Used as crypto price fallback when Binance is blocked.
"""
from datetime import datetime, timezone

import httpx

from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

# Map our symbols to KuCoin symbols
KUCOIN_SYMBOLS: dict[str, str] = {
    "BTCUSDT":  "BTC-USDT",
    "ETHUSDT":  "ETH-USDT",
    "SOLUSDT":  "SOL-USDT",
    "BNBUSDT":  "BNB-USDT",
    "XRPUSDT":  "XRP-USDT",
    "ADAUSDT":  "ADA-USDT",
    "DOGEUSDT": "DOGE-USDT",
}

KUCOIN_INTERVALS: dict[HistoryRange, str] = {
    HistoryRange.d1: "1hour",
    HistoryRange.w1: "1day",
    HistoryRange.m1: "1day",
    HistoryRange.y1: "1week",
}


class KuCoinProvider:
    BASE = "https://api.kucoin.com/api/v1"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        sym = KUCOIN_SYMBOLS.get(asset.symbol)
        if not sym:
            raise ValueError(f"KuCoin: unknown symbol {asset.symbol}")

        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f"{self.BASE}/market/stats", params={"symbol": sym})
            r.raise_for_status()
            data = r.json()["data"]

        price = float(data["last"])
        open_price = float(data.get("open", price))
        change = round(price - open_price, 8)
        change_pct = round(((price - open_price) / open_price * 100) if open_price else 0, 2)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_pct,
            timestamp=datetime.now(timezone.utc),
            source="kucoin",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        sym = KUCOIN_SYMBOLS.get(asset.symbol)
        if not sym:
            raise ValueError(f"KuCoin: unknown symbol {asset.symbol}")

        interval = KUCOIN_INTERVALS.get(history_range, "1day")

        # Calculate time range to get enough bars
        from datetime import timedelta
        now = datetime.now(timezone.utc)
        range_map = {
            HistoryRange.d1: (now - timedelta(days=1),   24),
            HistoryRange.w1: (now - timedelta(weeks=1),  7),
            HistoryRange.m1: (now - timedelta(days=60),  60),   # 2 months = enough bars
            HistoryRange.y1: (now - timedelta(days=365), 52),
        }
        start_dt, expected_bars = range_map.get(history_range, (now - timedelta(days=30), 30))
        start_ts = int(start_dt.timestamp())

        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                f"{self.BASE}/market/candles",
                params={"symbol": sym, "type": interval, "startAt": start_ts},
            )
            r.raise_for_status()
            rows = r.json()["data"]

        bars: list[OHLCVBar] = []
        for row in rows:
            ts = datetime.fromtimestamp(int(row[0]), tz=timezone.utc)
            bars.append(OHLCVBar(
                timestamp=ts,
                open=float(row[1]),
                high=float(row[3]),
                low=float(row[4]),
                close=float(row[2]),
                volume=float(row[5]),
            ))

        # KuCoin returns newest first — reverse for chronological order
        bars.reverse()
        return bars


kucoin_provider = KuCoinProvider()
