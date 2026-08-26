import httpx

from app.core.config import settings
from app.schemas.asset import HistoryRange, OHLCVBar, PriceResponse
from app.services.market_data.catalog import AssetDefinition
from app.services.market_data.mock_provider import mock_provider


class BinanceProvider:
    BASE_URL = "https://api.binance.com/api/v3"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        symbol = asset.external_symbol
        async with httpx.AsyncClient(timeout=10.0) as client:
            ticker = await client.get(f"{self.BASE_URL}/ticker/24hr", params={"symbol": symbol})
            ticker.raise_for_status()
            data = ticker.json()

        price = float(data["lastPrice"])
        change = float(data["priceChange"])
        change_percent = float(data["priceChangePercent"])

        from datetime import datetime, timezone

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_percent,
            timestamp=datetime.now(timezone.utc),
            source="binance",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        interval_map = {
            HistoryRange.d1: ("1h",  24),
            HistoryRange.w1: ("1d",  7),
            HistoryRange.m1: ("1d",  365),  # enough for 1Y backtest
            HistoryRange.y1: ("1w",  52),
        }
        interval, limit = interval_map[history_range]

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.BASE_URL}/klines",
                params={"symbol": asset.external_symbol, "interval": interval, "limit": limit},
            )
            response.raise_for_status()
            rows = response.json()

        from datetime import datetime, timezone

        bars: list[OHLCVBar] = []
        for row in rows:
            bars.append(
                OHLCVBar(
                    timestamp=datetime.fromtimestamp(row[0] / 1000, tz=timezone.utc),
                    open=float(row[1]),
                    high=float(row[2]),
                    low=float(row[3]),
                    close=float(row[4]),
                    volume=float(row[5]),
                )
            )
        return bars


class TwelveDataProvider:
    BASE_URL = "https://api.twelvedata.com"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        if not settings.twelve_data_api_key:
            return await mock_provider.get_price(asset)

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.BASE_URL}/quote",
                params={"symbol": asset.external_symbol, "apikey": settings.twelve_data_api_key},
            )
            response.raise_for_status()
            data = response.json()

        if data.get("status") == "error" or "close" not in data:
            return await mock_provider.get_price(asset)

        from datetime import datetime, timezone

        price = float(data["close"])
        change = float(data.get("change", 0) or 0)
        change_percent = float(data.get("percent_change", 0) or 0)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_percent,
            timestamp=datetime.now(timezone.utc),
            source="twelvedata",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        if not settings.twelve_data_api_key:
            return await mock_provider.get_history(asset, history_range)

        interval_map = {
            HistoryRange.d1: ("1h", 24),
            HistoryRange.w1: ("1day", 7),
            HistoryRange.m1: ("1day", 365),   # enough for 1Y backtest
            HistoryRange.y1: ("1week", 52),
        }
        interval, outputsize = interval_map[history_range]

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.BASE_URL}/time_series",
                params={
                    "symbol": asset.external_symbol,
                    "interval": interval,
                    "outputsize": outputsize,
                    "apikey": settings.twelve_data_api_key,
                },
            )
            response.raise_for_status()
            data = response.json()

        if data.get("status") == "error" or "values" not in data:
            return await mock_provider.get_history(asset, history_range)

        from datetime import datetime, timezone

        bars: list[OHLCVBar] = []
        for row in reversed(data["values"]):
            bars.append(
                OHLCVBar(
                    timestamp=datetime.fromisoformat(row["datetime"].replace("Z", "+00:00")),
                    open=float(row["open"]),
                    high=float(row["high"]),
                    low=float(row["low"]),
                    close=float(row["close"]),
                    volume=float(row.get("volume") or 0),
                )
            )
        return bars


class AlphaVantageProvider:
    BASE_URL = "https://www.alphavantage.co/query"

    async def get_price(self, asset: AssetDefinition) -> PriceResponse:
        if not settings.alpha_vantage_api_key:
            return await mock_provider.get_price(asset)

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                self.BASE_URL,
                params={
                    "function": "GLOBAL_QUOTE",
                    "symbol": asset.external_symbol,
                    "apikey": settings.alpha_vantage_api_key,
                },
            )
            response.raise_for_status()
            data = response.json()

        quote = data.get("Global Quote", {})
        if not quote or "05. price" not in quote:
            return await mock_provider.get_price(asset)

        from datetime import datetime, timezone

        price = float(quote["05. price"])
        change = float(quote.get("09. change", 0) or 0)
        change_percent_raw = quote.get("10. change percent", "0%").replace("%", "")
        change_percent = float(change_percent_raw)

        return PriceResponse(
            symbol=asset.symbol,
            market_type=asset.market_type,
            price=price,
            change=change,
            change_percent=change_percent,
            timestamp=datetime.now(timezone.utc),
            source="alphavantage",
        )

    async def get_history(self, asset: AssetDefinition, history_range: HistoryRange) -> list[OHLCVBar]:
        if not settings.alpha_vantage_api_key:
            return await mock_provider.get_history(asset, history_range)

        function = "TIME_SERIES_INTRADAY" if history_range == HistoryRange.d1 else "TIME_SERIES_DAILY"
        params = {
            "function": function,
            "symbol": asset.external_symbol,
            "apikey": settings.alpha_vantage_api_key,
        }
        if history_range == HistoryRange.d1:
            params["interval"] = "60min"

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(self.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()

        series_key = next((key for key in data if key.startswith("Time Series")), None)
        if not series_key:
            return await mock_provider.get_history(asset, history_range)

        from datetime import datetime, timezone

        limit_map = {HistoryRange.d1: 24, HistoryRange.w1: 7, HistoryRange.m1: 200, HistoryRange.y1: 52}
        limit = limit_map[history_range]

        bars: list[OHLCVBar] = []
        for ts_str, row in list(data[series_key].items())[:limit]:
            bars.append(
                OHLCVBar(
                    timestamp=datetime.fromisoformat(ts_str).replace(tzinfo=timezone.utc),
                    open=float(row["1. open"]),
                    high=float(row["2. high"]),
                    low=float(row["3. low"]),
                    close=float(row["4. close"]),
                    volume=float(row.get("5. volume") or 0),
                )
            )
        bars.sort(key=lambda bar: bar.timestamp)
        return bars


binance_provider = BinanceProvider()
twelve_data_provider = TwelveDataProvider()
alpha_vantage_provider = AlphaVantageProvider()
