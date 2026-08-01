from app.schemas.asset import HistoryRange, HistoryResponse, MarketType, PriceResponse
from app.services.market_data.catalog import AssetDefinition, get_asset, list_assets
from app.services.market_data.coingecko import coingecko_provider
from app.services.market_data.exchangerate import exchangerate_provider
from app.services.market_data.kucoin import kucoin_provider
from app.services.market_data.mock_provider import mock_provider
from app.services.market_data.polygon import polygon_provider
from app.services.market_data.yahoo import yahoo_provider, YAHOO_SYMBOLS
from app.services.market_data.providers import (
    alpha_vantage_provider,
    binance_provider,
    twelve_data_provider,
)


class MarketDataAggregator:
    async def list_assets(self, market: MarketType | None = None) -> list[AssetDefinition]:
        return list_assets(market)

    async def get_price(self, symbol: str) -> PriceResponse:
        asset = self._require_asset(symbol)

        # Crypto: try Binance → KuCoin → CoinGecko → mock
        if asset.market_type == MarketType.crypto:
            for provider in [binance_provider, kucoin_provider, coingecko_provider, mock_provider]:
                try:
                    return await provider.get_price(asset)
                except Exception:
                    continue
            return await mock_provider.get_price(asset)

        # Forex: TwelveData → ExchangeRate (free fallback) → mock
        if asset.market_type == MarketType.forex and asset.symbol not in YAHOO_SYMBOLS:
            for provider in [twelve_data_provider, exchangerate_provider, mock_provider]:
                try:
                    return await provider.get_price(asset)
                except Exception:
                    continue
            return await mock_provider.get_price(asset)

        # Special case: Yahoo symbols (Silver, Oil, Gold, indices, AMZN, META)
        if asset.symbol in YAHOO_SYMBOLS:
            for provider in [yahoo_provider, mock_provider]:
                try:
                    return await provider.get_price(asset)
                except Exception:
                    continue
            return await mock_provider.get_price(asset)

        # Stocks: Polygon → mock
        provider = self._provider_for(asset)
        try:
            return await provider.get_price(asset)
        except Exception:
            if asset.market_type == MarketType.stock:
                try:
                    return await polygon_provider.get_price(asset)
                except Exception:
                    pass
            return await mock_provider.get_price(asset)

    async def get_history(self, symbol: str, history_range: HistoryRange) -> HistoryResponse:
        asset = self._require_asset(symbol)

        # Crypto: try Binance → KuCoin → CoinGecko → mock
        if asset.market_type == MarketType.crypto:
            for provider, src in [
                (binance_provider, "binance"),
                (kucoin_provider, "kucoin"),
                (coingecko_provider, "coingecko"),
            ]:
                try:
                    bars = await provider.get_history(asset, history_range)
                    return HistoryResponse(
                        symbol=asset.symbol,
                        market_type=asset.market_type,
                        range=history_range,
                        bars=bars,
                        source=src,
                    )
                except Exception:
                    continue
            bars = await mock_provider.get_history(asset, history_range)
            return HistoryResponse(symbol=asset.symbol, market_type=asset.market_type,
                                   range=history_range, bars=bars, source="mock")

        # Forex / Stocks / Commodities
        if asset.symbol in YAHOO_SYMBOLS:
            for provider, src in [(yahoo_provider, "yahoo"), (mock_provider, "mock")]:
                try:
                    bars = await provider.get_history(asset, history_range)
                    return HistoryResponse(symbol=asset.symbol, market_type=asset.market_type,
                                          range=history_range, bars=bars, source=src)
                except Exception:
                    continue

        provider = self._provider_for(asset)
        source_name = "twelvedata" if asset.market_type == MarketType.forex else "polygon"
        try:
            bars = await provider.get_history(asset, history_range)
            return HistoryResponse(symbol=asset.symbol, market_type=asset.market_type,
                                   range=history_range, bars=bars, source=source_name)
        except Exception:
            bars = await mock_provider.get_history(asset, history_range)
            return HistoryResponse(symbol=asset.symbol, market_type=asset.market_type,
                                   range=history_range, bars=bars, source="mock")

    async def get_prices(self, symbols: list[str]) -> list[PriceResponse]:
        import asyncio
        async def _safe(sym: str) -> PriceResponse | None:
            try:
                return await self.get_price(sym)
            except ValueError:
                return None

        results = await asyncio.gather(*[_safe(s) for s in symbols])
        return [r for r in results if r is not None]

    def _require_asset(self, symbol: str) -> AssetDefinition:
        asset = get_asset(symbol)
        if asset is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")
        return asset

    def _provider_for(self, asset: AssetDefinition):
        if asset.market_type == MarketType.forex:
            return twelve_data_provider
        if asset.market_type == MarketType.stock:
            return polygon_provider
        return alpha_vantage_provider


aggregator = MarketDataAggregator()
