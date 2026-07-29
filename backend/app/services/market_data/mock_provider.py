import hashlib
import random
from datetime import datetime, timedelta, timezone

from app.schemas.asset import HistoryRange, MarketType, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition, get_asset


class MockProvider:
    """Deterministic mock prices when external APIs are unavailable."""

    _BASE_PRICES: dict[str, float] = {
        # Forex majors
        "EURUSD": 1.085,
        "GBPUSD": 1.265,
        "USDJPY": 149.5,
        "AUDUSD": 0.645,
        "USDCAD": 1.365,
        "USDCHF": 0.905,
        "NZDUSD": 0.595,
        # Commodities
        "XAUUSD": 2340.0,
        "XAGUSD": 27.5,
        "USOIL": 78.5,
        # Crypto
        "BTCUSDT": 67500.0,
        "ETHUSDT": 3450.0,
        "SOLUSDT": 175.0,
        "BNBUSDT": 590.0,
        "XRPUSDT": 0.52,
        "ADAUSDT": 0.44,
        "DOGEUSDT": 0.155,
        # Stocks
        "AAPL": 195.0,
        "MSFT": 425.0,
        "TSLA": 248.0,
        "GOOGL": 175.0,
        "AMZN": 185.0,
        "NVDA": 875.0,
        "META": 510.0,
        # Indices ETFs
        "SPY": 525.0,
        "QQQ": 445.0,
        "DIA": 390.0,
    }

    def _seed(self, symbol: str) -> random.Random:
        digest = hashlib.sha256(symbol.encode()).hexdigest()
        return random.Random(int(digest[:8], 16))

    def _base_price(self, symbol: str) -> float:
        return self._BASE_PRICES.get(symbol.upper(), 100.0)

    def _jitter(self, symbol: str, pct: float = 0.002) -> float:
        rng = self._seed(symbol + datetime.now(timezone.utc).strftime("%Y%m%d%H%M"))
        base = self._base_price(symbol)
        delta = base * pct * rng.uniform(-1, 1)
        return round(base + delta, 6 if base < 10 else 2)

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        price = self._jitter(asset.symbol)
        base = self._base_price(asset.symbol)
        change = round(price - base, 6 if base < 10 else 2)
        change_percent = round((change / base) * 100, 2) if base else None
        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_percent,
            timestamp=datetime.now(timezone.utc),
            source="mock",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        now = datetime.now(timezone.utc)
        if history_range == HistoryRange.d1:
            points, step = 24, timedelta(hours=1)
        elif history_range == HistoryRange.w1:
            points, step = 7, timedelta(days=1)
        elif history_range == HistoryRange.y1:
            points, step = 52, timedelta(weeks=1)
        else:
            points, step = 200, timedelta(days=1)

        rng = self._seed(asset.symbol + history_range.value)
        base = self._base_price(asset.symbol)
        bars: list[OHLCVBar] = []
        price = base * (1 + rng.uniform(-0.02, 0.02))

        for i in range(points):
            ts = now - step * (points - i)
            drift = rng.uniform(-0.01, 0.01)
            open_price = price
            close_price = max(0.01, price * (1 + drift))
            high = max(open_price, close_price) * (1 + abs(rng.uniform(0, 0.005)))
            low = min(open_price, close_price) * (1 - abs(rng.uniform(0, 0.005)))
            volume = abs(rng.gauss(1_000_000, 250_000))
            bars.append(
                OHLCVBar(
                    timestamp=ts,
                    open=round(open_price, 6 if base < 10 else 2),
                    high=round(high, 6 if base < 10 else 2),
                    low=round(low, 6 if base < 10 else 2),
                    close=round(close_price, 6 if base < 10 else 2),
                    volume=round(volume, 2),
                )
            )
            price = close_price

        return bars


mock_provider = MockProvider()
