from dataclasses import dataclass

from app.schemas.asset import MarketType


@dataclass(frozen=True)
class AssetDefinition:
    symbol: str
    market_type: MarketType
    name: str
    provider_symbol: str | None = None

    @property
    def external_symbol(self) -> str:
        return self.provider_symbol or self.symbol


DEFAULT_ASSETS: list[AssetDefinition] = [
    # Forex — Major pairs
    AssetDefinition("EURUSD", MarketType.forex, "Euro / US Dollar", "EUR/USD"),
    AssetDefinition("GBPUSD", MarketType.forex, "British Pound / US Dollar", "GBP/USD"),
    AssetDefinition("USDJPY", MarketType.forex, "US Dollar / Japanese Yen", "USD/JPY"),
    AssetDefinition("AUDUSD", MarketType.forex, "Australian Dollar / US Dollar", "AUD/USD"),
    AssetDefinition("USDCAD", MarketType.forex, "US Dollar / Canadian Dollar", "USD/CAD"),
    AssetDefinition("USDCHF", MarketType.forex, "US Dollar / Swiss Franc", "USD/CHF"),
    AssetDefinition("NZDUSD", MarketType.forex, "New Zealand Dollar / US Dollar", "NZD/USD"),
    # Commodities
    AssetDefinition("XAUUSD", MarketType.forex, "Gold / US Dollar", "XAU/USD"),
    AssetDefinition("XAGUSD", MarketType.forex, "Silver / US Dollar", "XAG/USD"),
    AssetDefinition("USOIL",  MarketType.forex, "Crude Oil (WTI)", "WTI/USD"),
    # Crypto — Top coins
    AssetDefinition("BTCUSDT", MarketType.crypto, "Bitcoin", "BTCUSDT"),
    AssetDefinition("ETHUSDT", MarketType.crypto, "Ethereum", "ETHUSDT"),
    AssetDefinition("SOLUSDT", MarketType.crypto, "Solana", "SOLUSDT"),
    AssetDefinition("BNBUSDT", MarketType.crypto, "BNB", "BNBUSDT"),
    AssetDefinition("XRPUSDT", MarketType.crypto, "XRP", "XRPUSDT"),
    AssetDefinition("ADAUSDT", MarketType.crypto, "Cardano", "ADAUSDT"),
    AssetDefinition("DOGEUSDT", MarketType.crypto, "Dogecoin", "DOGEUSDT"),
    # Stocks — US Large-caps
    AssetDefinition("AAPL", MarketType.stock, "Apple Inc."),
    AssetDefinition("MSFT", MarketType.stock, "Microsoft Corporation"),
    AssetDefinition("TSLA", MarketType.stock, "Tesla Inc."),
    AssetDefinition("GOOGL", MarketType.stock, "Alphabet (Google)"),
    AssetDefinition("AMZN", MarketType.stock, "Amazon.com Inc."),
    AssetDefinition("NVDA", MarketType.stock, "NVIDIA Corporation"),
    AssetDefinition("META", MarketType.stock, "Meta Platforms Inc."),
    # Indices (via stock provider)
    AssetDefinition("SPY", MarketType.stock, "S&P 500 ETF"),
    AssetDefinition("QQQ", MarketType.stock, "NASDAQ 100 ETF"),
    AssetDefinition("DIA", MarketType.stock, "Dow Jones ETF"),
]

_ASSET_BY_SYMBOL = {asset.symbol.upper(): asset for asset in DEFAULT_ASSETS}


def get_asset(symbol: str) -> AssetDefinition | None:
    return _ASSET_BY_SYMBOL.get(symbol.upper())


def list_assets(market: MarketType | None = None) -> list[AssetDefinition]:
    if market is None:
        return list(DEFAULT_ASSETS)
    return [asset for asset in DEFAULT_ASSETS if asset.market_type == market]
