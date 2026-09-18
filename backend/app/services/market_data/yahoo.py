"""
Yahoo Finance provider — free, no API key needed.
Used for Silver (XAG) and Oil (WTI) which TwelveData free tier doesn't support.
"""
from datetime import datetime, timedelta, timezone

import httpx

from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

# Map our symbols to Yahoo Finance tickers
YAHOO_SYMBOLS: dict[str, str] = {
    # Commodities
    "XAGUSD":  "SI=F",    # Silver futures
    "USOIL":   "CL=F",    # WTI Crude Oil futures
    "XAUUSD":  "GC=F",    # Gold futures
    "UKOIL":   "BZ=F",    # Brent Crude Oil futures
    "XPTUSD":  "PL=F",    # Platinum futures
    "XPDUSD":  "PA=F",    # Palladium futures
    "NATGAS":  "NG=F",    # Natural Gas futures
    "COPPER":  "HG=F",    # Copper futures
    "WHEAT":   "ZW=F",    # Wheat futures
    "CORN":    "ZC=F",    # Corn futures
    # US Stocks that need Yahoo fallback
    "AMZN":    "AMZN",
    "META":    "META",
    "BRKB":    "BRK-B",   # Berkshire B
    "BABA":    "BABA",
    "PDD":     "PDD",
    # ETFs — all via Yahoo
    "SPY":     "SPY",
    "QQQ":     "QQQ",
    "DIA":     "DIA",
    "IWM":     "IWM",
    "VTI":     "VTI",
    "VOO":     "VOO",
    "GLD":     "GLD",
    "SLV":     "SLV",
    "USO":     "USO",
    "TLT":     "TLT",
    "XLF":     "XLF",
    "XLK":     "XLK",
    "XLE":     "XLE",
    "XLV":     "XLV",
    "ARKK":    "ARKK",
    "ARKG":    "ARKG",
    "ARKW":    "ARKW",
    "SQQQ":    "SQQQ",
    "SPXU":    "SPXU",
    "TQQQ":    "TQQQ",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
}


class YahooFinanceProvider:
    BASE = "https://query1.finance.yahoo.com/v8/finance/chart"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        ticker = YAHOO_SYMBOLS.get(asset.symbol)
        if not ticker:
            raise ValueError(f"Yahoo: unknown symbol {asset.symbol}")

        async with httpx.AsyncClient(timeout=10.0, headers=HEADERS) as client:
            r = await client.get(f"{self.BASE}/{ticker}",
                                 params={"interval": "1d", "range": "1d"})
            r.raise_for_status()
            data = r.json()

        meta = data["chart"]["result"][0]["meta"]
        price = float(meta["regularMarketPrice"])
        prev_close = float(meta.get("chartPreviousClose", price))
        change = round(price - prev_close, 4)
        change_pct = round(((price - prev_close) / prev_close * 100) if prev_close else 0, 2)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_pct,
            timestamp=datetime.now(timezone.utc),
            source="yahoo",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        ticker = YAHOO_SYMBOLS.get(asset.symbol)
        if not ticker:
            raise ValueError(f"Yahoo: unknown symbol {asset.symbol}")

        range_map = {
            HistoryRange.d1: ("1h",  "1d"),
            HistoryRange.w1: ("1d",  "5d"),
            HistoryRange.m1: ("1d",  "1mo"),
            HistoryRange.y1: ("1wk", "1y"),
        }
        interval, period = range_map[history_range]

        async with httpx.AsyncClient(timeout=15.0, headers=HEADERS) as client:
            r = await client.get(f"{self.BASE}/{ticker}",
                                 params={"interval": interval, "range": period})
            r.raise_for_status()
            data = r.json()

        result = data["chart"]["result"][0]
        timestamps = result["timestamp"]
        ohlcv = result["indicators"]["quote"][0]

        bars: list[OHLCVBar] = []
        for i, ts in enumerate(timestamps):
            try:
                bars.append(OHLCVBar(
                    timestamp=datetime.fromtimestamp(ts, tz=timezone.utc),
                    open=float(ohlcv["open"][i] or 0),
                    high=float(ohlcv["high"][i] or 0),
                    low=float(ohlcv["low"][i] or 0),
                    close=float(ohlcv["close"][i] or 0),
                    volume=float(ohlcv.get("volume", [0])[i] or 0),
                ))
            except (TypeError, IndexError):
                continue
        return bars


yahoo_provider = YahooFinanceProvider()
