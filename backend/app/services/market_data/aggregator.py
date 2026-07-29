from app.schemas.asset import HistoryRange, HistoryResponse, MarketType, PriceResponse
from app.services.market_data.catalog import AssetDefinition, get_asset, list_assets
from app.services.market_data.mock_provider import mock_provider
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
        provider = self._provider_for(asset)
        try:
            return await provider.get_price(asset)
        except Exception:
            return await mock_provider.get_price(asset)

    async def get_history(self, symbol: str, history_range: HistoryRange) -> HistoryResponse:
        asset = self._require_asset(symbol)
        provider = self._provider_for(asset)
        try:
            bars = await provider.get_history(asset, history_range)
            source = "mock"
            if asset.market_type == MarketType.crypto:
                source = "binance"
            elif asset.market_type == MarketType.forex:
                source = "twelvedata"
            else:
                source = "alphavantage"
            return HistoryResponse(
                symbol=asset.symbol,
                market_type=asset.market_type,
                range=history_range,
                bars=bars,
                source=source,
            )
        except Exception:
            bars = await mock_provider.get_history(asset, history_range)
            return HistoryResponse(
                symbol=asset.symbol,
                market_type=asset.market_type,
                range=history_range,
                bars=bars,
                source="mock",
            )

    async def get_prices(self, symbols: list[str]) -> list[PriceResponse]:
        results: list[PriceResponse] = []
        for symbol in symbols:
            try:
                results.append(await self.get_price(symbol))
            except ValueError:
                continue
        return results

    def _require_asset(self, symbol: str) -> AssetDefinition:
        asset = get_asset(symbol)
        if asset is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")
        return asset

    def _provider_for(self, asset: AssetDefinition):
        if asset.market_type == MarketType.crypto:
            return binance_provider
        if asset.market_type == MarketType.forex:
            return twelve_data_provider
        return alpha_vantage_provider
