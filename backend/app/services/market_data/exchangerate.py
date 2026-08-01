"""
ExchangeRate-API — completely free, no API key, no daily limit.
Used as forex fallback when TwelveData daily limit is exhausted.
https://open.er-api.com
"""
from datetime import datetime, timezone

import httpx

from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition

# Map our symbols to base/quote currencies
FOREX_MAP: dict[str, tuple[str, str]] = {
    "EURUSD":  ("EUR", "USD"),
    "GBPUSD":  ("GBP", "USD"),
    "USDJPY":  ("USD", "JPY"),
    "AUDUSD":  ("AUD", "USD"),
    "USDCAD":  ("USD", "CAD"),
    "USDCHF":  ("USD", "CHF"),
    "NZDUSD":  ("NZD", "USD"),
}

# Cache rates for 5 min to avoid hammering the API
_cache: dict[str, tuple[float, float]] = {}  # symbol -> (price, timestamp)
_CACHE_TTL = 300  # 5 minutes


class ExchangeRateProvider:
    BASE = "https://open.er-api.com/v6/latest"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        pair = FOREX_MAP.get(asset.symbol)
        if not pair:
            raise ValueError(f"ExchangeRate: unknown symbol {asset.symbol}")

        base_currency, quote_currency = pair
        now = datetime.now(timezone.utc).timestamp()

        # Check cache
        cached = _cache.get(asset.symbol)
        if cached and (now - cached[1]) < _CACHE_TTL:
            price = cached[0]
            return PriceResponse(
                symbol=asset.symbol,
                market_type=asset.market_type,
                price=price,
                change=None,
                change_percent=None,
                timestamp=datetime.now(timezone.utc),
                source="exchangerate",
            )

        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(f"{self.BASE}/{base_currency}")
            r.raise_for_status()
            data = r.json()

        rates = data.get("rates", {})
        if quote_currency not in rates:
            raise ValueError(f"Rate not found: {base_currency}/{quote_currency}")

        # Calculate price: base/quote
        if base_currency == "USD":
            price = round(float(rates[quote_currency]), 5)
        else:
            # base is not USD — use USD as intermediate
            base_in_usd = rates.get("USD", 1.0) / rates.get(base_currency, 1.0)
            if quote_currency == "USD":
                price = round(base_in_usd, 5)
            else:
                price = round(base_in_usd * rates[quote_currency], 5)

        # Cache it
        _cache[asset.symbol] = (price, now)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=None,
            change_percent=None,
            timestamp=datetime.now(timezone.utc),
            source="exchangerate",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        # ExchangeRate-API free doesn't support historical data
        raise ValueError("ExchangeRate: no historical data on free plan")


exchangerate_provider = ExchangeRateProvider()
