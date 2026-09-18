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

    # ── FOREX — Major Pairs ───────────────────────────────────────────────────
    AssetDefinition("EURUSD",  MarketType.forex, "Euro / US Dollar",                  "EUR/USD"),
    AssetDefinition("GBPUSD",  MarketType.forex, "British Pound / US Dollar",         "GBP/USD"),
    AssetDefinition("USDJPY",  MarketType.forex, "US Dollar / Japanese Yen",          "USD/JPY"),
    AssetDefinition("AUDUSD",  MarketType.forex, "Australian Dollar / US Dollar",     "AUD/USD"),
    AssetDefinition("USDCAD",  MarketType.forex, "US Dollar / Canadian Dollar",       "USD/CAD"),
    AssetDefinition("USDCHF",  MarketType.forex, "US Dollar / Swiss Franc",           "USD/CHF"),
    AssetDefinition("NZDUSD",  MarketType.forex, "New Zealand Dollar / US Dollar",    "NZD/USD"),
    AssetDefinition("EURGBP",  MarketType.forex, "Euro / British Pound",              "EUR/GBP"),
    AssetDefinition("EURJPY",  MarketType.forex, "Euro / Japanese Yen",               "EUR/JPY"),
    AssetDefinition("GBPJPY",  MarketType.forex, "British Pound / Japanese Yen",      "GBP/JPY"),
    AssetDefinition("AUDJPY",  MarketType.forex, "Australian Dollar / Japanese Yen",  "AUD/JPY"),
    AssetDefinition("EURAUD",  MarketType.forex, "Euro / Australian Dollar",          "EUR/AUD"),
    AssetDefinition("EURCHF",  MarketType.forex, "Euro / Swiss Franc",                "EUR/CHF"),
    AssetDefinition("GBPAUD",  MarketType.forex, "British Pound / Australian Dollar", "GBP/AUD"),
    AssetDefinition("GBPCAD",  MarketType.forex, "British Pound / Canadian Dollar",   "GBP/CAD"),
    AssetDefinition("GBPCHF",  MarketType.forex, "British Pound / Swiss Franc",       "GBP/CHF"),
    AssetDefinition("AUDCAD",  MarketType.forex, "Australian Dollar / Canadian Dollar","AUD/CAD"),
    AssetDefinition("AUDCHF",  MarketType.forex, "Australian Dollar / Swiss Franc",   "AUD/CHF"),
    AssetDefinition("AUDNZD",  MarketType.forex, "Australian Dollar / New Zealand Dollar","AUD/NZD"),
    AssetDefinition("CADJPY",  MarketType.forex, "Canadian Dollar / Japanese Yen",   "CAD/JPY"),
    AssetDefinition("CHFJPY",  MarketType.forex, "Swiss Franc / Japanese Yen",        "CHF/JPY"),
    AssetDefinition("NZDJPY",  MarketType.forex, "New Zealand Dollar / Japanese Yen","NZD/JPY"),
    AssetDefinition("EURCAD",  MarketType.forex, "Euro / Canadian Dollar",            "EUR/CAD"),
    AssetDefinition("EURNZD",  MarketType.forex, "Euro / New Zealand Dollar",         "EUR/NZD"),
    AssetDefinition("CADCHF",  MarketType.forex, "Canadian Dollar / Swiss Franc",     "CAD/CHF"),
    AssetDefinition("NZDCAD",  MarketType.forex, "New Zealand Dollar / Canadian Dollar","NZD/CAD"),
    AssetDefinition("NZDCHF",  MarketType.forex, "New Zealand Dollar / Swiss Franc",  "NZD/CHF"),

    # ── FOREX — Emerging Market Pairs ────────────────────────────────────────
    AssetDefinition("USDINR",  MarketType.forex, "US Dollar / Indian Rupee",          "USD/INR"),
    AssetDefinition("USDPKR",  MarketType.forex, "US Dollar / Pakistani Rupee",       "USD/PKR"),
    AssetDefinition("USDBRL",  MarketType.forex, "US Dollar / Brazilian Real",        "USD/BRL"),
    AssetDefinition("USDMXN",  MarketType.forex, "US Dollar / Mexican Peso",          "USD/MXN"),
    AssetDefinition("USDTRY",  MarketType.forex, "US Dollar / Turkish Lira",          "USD/TRY"),
    AssetDefinition("USDZAR",  MarketType.forex, "US Dollar / South African Rand",    "USD/ZAR"),
    AssetDefinition("USDSGD",  MarketType.forex, "US Dollar / Singapore Dollar",      "USD/SGD"),
    AssetDefinition("USDHKD",  MarketType.forex, "US Dollar / Hong Kong Dollar",      "USD/HKD"),
    AssetDefinition("USDCNY",  MarketType.forex, "US Dollar / Chinese Yuan",          "USD/CNY"),
    AssetDefinition("USDKRW",  MarketType.forex, "US Dollar / South Korean Won",      "USD/KRW"),
    AssetDefinition("USDEGP",  MarketType.forex, "US Dollar / Egyptian Pound",        "USD/EGP"),
    AssetDefinition("USDNGN",  MarketType.forex, "US Dollar / Nigerian Naira",        "USD/NGN"),
    AssetDefinition("USDKES",  MarketType.forex, "US Dollar / Kenyan Shilling",       "USD/KES"),
    AssetDefinition("USDPHP",  MarketType.forex, "US Dollar / Philippine Peso",       "USD/PHP"),
    AssetDefinition("USDTHB",  MarketType.forex, "US Dollar / Thai Baht",             "USD/THB"),
    AssetDefinition("USDIDR",  MarketType.forex, "US Dollar / Indonesian Rupiah",     "USD/IDR"),

    # ── COMMODITIES ───────────────────────────────────────────────────────────
    AssetDefinition("XAUUSD",  MarketType.forex, "Gold / US Dollar",                  "XAU/USD"),
    AssetDefinition("XAGUSD",  MarketType.forex, "Silver / US Dollar",                "XAG/USD"),
    AssetDefinition("USOIL",   MarketType.forex, "Crude Oil (WTI)",                   "WTI/USD"),
    AssetDefinition("UKOIL",   MarketType.forex, "Brent Crude Oil",                   "BRN/USD"),
    AssetDefinition("XPTUSD",  MarketType.forex, "Platinum / US Dollar",              "XPT/USD"),
    AssetDefinition("XPDUSD",  MarketType.forex, "Palladium / US Dollar",             "XPD/USD"),
    AssetDefinition("NATGAS",  MarketType.forex, "Natural Gas",                        "NATGAS"),
    AssetDefinition("COPPER",  MarketType.forex, "Copper",                             "HG/USD"),
    AssetDefinition("WHEAT",   MarketType.forex, "Wheat",                              "ZW/USD"),
    AssetDefinition("CORN",    MarketType.forex, "Corn",                               "ZC/USD"),

    # ── CRYPTO — Top 50 Coins ─────────────────────────────────────────────────
    AssetDefinition("BTCUSDT",  MarketType.crypto, "Bitcoin",              "BTCUSDT"),
    AssetDefinition("ETHUSDT",  MarketType.crypto, "Ethereum",             "ETHUSDT"),
    AssetDefinition("SOLUSDT",  MarketType.crypto, "Solana",               "SOLUSDT"),
    AssetDefinition("BNBUSDT",  MarketType.crypto, "BNB",                  "BNBUSDT"),
    AssetDefinition("XRPUSDT",  MarketType.crypto, "XRP",                  "XRPUSDT"),
    AssetDefinition("ADAUSDT",  MarketType.crypto, "Cardano",              "ADAUSDT"),
    AssetDefinition("DOGEUSDT", MarketType.crypto, "Dogecoin",             "DOGEUSDT"),
    AssetDefinition("AVAXUSDT", MarketType.crypto, "Avalanche",            "AVAXUSDT"),
    AssetDefinition("DOTUSDT",  MarketType.crypto, "Polkadot",             "DOTUSDT"),
    AssetDefinition("MATICUSDT",MarketType.crypto, "Polygon (MATIC)",      "MATICUSDT"),
    AssetDefinition("LINKUSDT", MarketType.crypto, "Chainlink",            "LINKUSDT"),
    AssetDefinition("LTCUSDT",  MarketType.crypto, "Litecoin",             "LTCUSDT"),
    AssetDefinition("UNIUSDT",  MarketType.crypto, "Uniswap",              "UNIUSDT"),
    AssetDefinition("ATOMUSDT", MarketType.crypto, "Cosmos",               "ATOMUSDT"),
    AssetDefinition("ETCUSDT",  MarketType.crypto, "Ethereum Classic",     "ETCUSDT"),
    AssetDefinition("XLMUSDT",  MarketType.crypto, "Stellar",              "XLMUSDT"),
    AssetDefinition("TRXUSDT",  MarketType.crypto, "TRON",                 "TRXUSDT"),
    AssetDefinition("NEARUSDT", MarketType.crypto, "NEAR Protocol",        "NEARUSDT"),
    AssetDefinition("ALGOUSDT", MarketType.crypto, "Algorand",             "ALGOUSDT"),
    AssetDefinition("FILUSDT",  MarketType.crypto, "Filecoin",             "FILUSDT"),
    AssetDefinition("ICPUSDT",  MarketType.crypto, "Internet Computer",    "ICPUSDT"),
    AssetDefinition("AAVEUSDT", MarketType.crypto, "Aave",                 "AAVEUSDT"),
    AssetDefinition("APTUSDT",  MarketType.crypto, "Aptos",                "APTUSDT"),
    AssetDefinition("ARBUSDT",  MarketType.crypto, "Arbitrum",             "ARBUSDT"),
    AssetDefinition("OPUSDT",   MarketType.crypto, "Optimism",             "OPUSDT"),
    AssetDefinition("SHIBUSDT", MarketType.crypto, "Shiba Inu",            "SHIBUSDT"),
    AssetDefinition("SUIUSDT",  MarketType.crypto, "Sui",                  "SUIUSDT"),
    AssetDefinition("TONUSDT",  MarketType.crypto, "Toncoin",              "TONUSDT"),
    AssetDefinition("INJUSDT",  MarketType.crypto, "Injective",            "INJUSDT"),
    AssetDefinition("MKRUSDT",  MarketType.crypto, "Maker",                "MKRUSDT"),
    AssetDefinition("STXUSDT",  MarketType.crypto, "Stacks",               "STXUSDT"),
    AssetDefinition("RUNEUSDT", MarketType.crypto, "THORChain",            "RUNEUSDT"),
    AssetDefinition("FTMUSDT",  MarketType.crypto, "Fantom",               "FTMUSDT"),
    AssetDefinition("SANDUSDT", MarketType.crypto, "The Sandbox",          "SANDUSDT"),
    AssetDefinition("MANAUSDT", MarketType.crypto, "Decentraland",         "MANAUSDT"),
    AssetDefinition("AXSUSDT",  MarketType.crypto, "Axie Infinity",        "AXSUSDT"),
    AssetDefinition("GALAUSDT", MarketType.crypto, "Gala",                 "GALAUSDT"),
    AssetDefinition("APEUSDT",  MarketType.crypto, "ApeCoin",              "APEUSDT"),
    AssetDefinition("LDOUSDT",  MarketType.crypto, "Lido DAO",             "LDOUSDT"),
    AssetDefinition("CRVUSDT",  MarketType.crypto, "Curve DAO",            "CRVUSDT"),
    AssetDefinition("GRTUSDT",  MarketType.crypto, "The Graph",            "GRTUSDT"),
    AssetDefinition("SNXUSDT",  MarketType.crypto, "Synthetix",            "SNXUSDT"),
    AssetDefinition("COMPUSDT", MarketType.crypto, "Compound",             "COMPUSDT"),
    AssetDefinition("1INCHUSDT",MarketType.crypto, "1inch Network",        "1INCHUSDT"),
    AssetDefinition("ENJUSDT",  MarketType.crypto, "Enjin Coin",           "ENJUSDT"),
    AssetDefinition("ZILUSDT",  MarketType.crypto, "Zilliqa",              "ZILUSDT"),
    AssetDefinition("HBARUSDT", MarketType.crypto, "Hedera",               "HBARUSDT"),
    AssetDefinition("QNTUSDT",  MarketType.crypto, "Quant",                "QNTUSDT"),
    AssetDefinition("EGLDUSDT", MarketType.crypto, "MultiversX (Elrond)",  "EGLDUSDT"),
    AssetDefinition("VETUSDT",  MarketType.crypto, "VeChain",              "VETUSDT"),

    # ── US STOCKS — Mega Cap Tech ─────────────────────────────────────────────
    AssetDefinition("AAPL",  MarketType.stock, "Apple Inc."),
    AssetDefinition("MSFT",  MarketType.stock, "Microsoft Corporation"),
    AssetDefinition("TSLA",  MarketType.stock, "Tesla Inc."),
    AssetDefinition("GOOGL", MarketType.stock, "Alphabet (Google)"),
    AssetDefinition("AMZN",  MarketType.stock, "Amazon.com Inc."),
    AssetDefinition("NVDA",  MarketType.stock, "NVIDIA Corporation"),
    AssetDefinition("META",  MarketType.stock, "Meta Platforms Inc."),
    AssetDefinition("NFLX",  MarketType.stock, "Netflix Inc."),
    AssetDefinition("AMD",   MarketType.stock, "Advanced Micro Devices"),
    AssetDefinition("INTC",  MarketType.stock, "Intel Corporation"),
    AssetDefinition("ORCL",  MarketType.stock, "Oracle Corporation"),
    AssetDefinition("CRM",   MarketType.stock, "Salesforce Inc."),
    AssetDefinition("ADBE",  MarketType.stock, "Adobe Inc."),
    AssetDefinition("PYPL",  MarketType.stock, "PayPal Holdings"),
    AssetDefinition("UBER",  MarketType.stock, "Uber Technologies"),
    AssetDefinition("SNAP",  MarketType.stock, "Snap Inc."),
    AssetDefinition("SPOT",  MarketType.stock, "Spotify Technology"),
    AssetDefinition("SHOP",  MarketType.stock, "Shopify Inc."),
    AssetDefinition("SQ",    MarketType.stock, "Block Inc. (Square)"),
    AssetDefinition("COIN",  MarketType.stock, "Coinbase Global"),
    AssetDefinition("RBLX",  MarketType.stock, "Roblox Corporation"),
    AssetDefinition("PLTR",  MarketType.stock, "Palantir Technologies"),
    AssetDefinition("AI",    MarketType.stock, "C3.ai Inc."),
    AssetDefinition("SMCI",  MarketType.stock, "Super Micro Computer"),
    AssetDefinition("IONQ",  MarketType.stock, "IonQ Inc."),

    # ── US STOCKS — Finance ───────────────────────────────────────────────────
    AssetDefinition("JPM",   MarketType.stock, "JPMorgan Chase"),
    AssetDefinition("BAC",   MarketType.stock, "Bank of America"),
    AssetDefinition("WFC",   MarketType.stock, "Wells Fargo"),
    AssetDefinition("GS",    MarketType.stock, "Goldman Sachs"),
    AssetDefinition("MS",    MarketType.stock, "Morgan Stanley"),
    AssetDefinition("V",     MarketType.stock, "Visa Inc."),
    AssetDefinition("MA",    MarketType.stock, "Mastercard Inc."),
    AssetDefinition("BRKB",  MarketType.stock, "Berkshire Hathaway B", "BRK.B"),
    AssetDefinition("BLK",   MarketType.stock, "BlackRock Inc."),
    AssetDefinition("AXP",   MarketType.stock, "American Express"),

    # ── US STOCKS — Healthcare ────────────────────────────────────────────────
    AssetDefinition("JNJ",   MarketType.stock, "Johnson & Johnson"),
    AssetDefinition("PFE",   MarketType.stock, "Pfizer Inc."),
    AssetDefinition("MRNA",  MarketType.stock, "Moderna Inc."),
    AssetDefinition("ABBV",  MarketType.stock, "AbbVie Inc."),
    AssetDefinition("LLY",   MarketType.stock, "Eli Lilly"),
    AssetDefinition("UNH",   MarketType.stock, "UnitedHealth Group"),
    AssetDefinition("CVS",   MarketType.stock, "CVS Health"),
    AssetDefinition("GILD",  MarketType.stock, "Gilead Sciences"),
    AssetDefinition("BIIB",  MarketType.stock, "Biogen Inc."),
    AssetDefinition("REGN",  MarketType.stock, "Regeneron Pharmaceuticals"),

    # ── US STOCKS — Energy ────────────────────────────────────────────────────
    AssetDefinition("XOM",   MarketType.stock, "ExxonMobil Corporation"),
    AssetDefinition("CVX",   MarketType.stock, "Chevron Corporation"),
    AssetDefinition("COP",   MarketType.stock, "ConocoPhillips"),
    AssetDefinition("SLB",   MarketType.stock, "Schlumberger"),
    AssetDefinition("OXY",   MarketType.stock, "Occidental Petroleum"),

    # ── US STOCKS — Consumer ─────────────────────────────────────────────────
    AssetDefinition("WMT",   MarketType.stock, "Walmart Inc."),
    AssetDefinition("COST",  MarketType.stock, "Costco Wholesale"),
    AssetDefinition("MCD",   MarketType.stock, "McDonald's Corporation"),
    AssetDefinition("KO",    MarketType.stock, "Coca-Cola Company"),
    AssetDefinition("PEP",   MarketType.stock, "PepsiCo Inc."),
    AssetDefinition("NKE",   MarketType.stock, "Nike Inc."),
    AssetDefinition("SBUX",  MarketType.stock, "Starbucks Corporation"),
    AssetDefinition("DIS",   MarketType.stock, "Walt Disney Company"),
    AssetDefinition("BABA",  MarketType.stock, "Alibaba Group"),
    AssetDefinition("PDD",   MarketType.stock, "PDD Holdings (Temu)"),

    # ── US STOCKS — Industrial / Other ───────────────────────────────────────
    AssetDefinition("BA",    MarketType.stock, "Boeing Company"),
    AssetDefinition("CAT",   MarketType.stock, "Caterpillar Inc."),
    AssetDefinition("GE",    MarketType.stock, "GE Aerospace"),
    AssetDefinition("HON",   MarketType.stock, "Honeywell International"),
    AssetDefinition("MMM",   MarketType.stock, "3M Company"),
    AssetDefinition("UPS",   MarketType.stock, "United Parcel Service"),
    AssetDefinition("FDX",   MarketType.stock, "FedEx Corporation"),
    AssetDefinition("LMT",   MarketType.stock, "Lockheed Martin"),
    AssetDefinition("RTX",   MarketType.stock, "RTX Corporation"),
    AssetDefinition("DE",    MarketType.stock, "Deere & Company"),

    # ── ETFs & Indices ────────────────────────────────────────────────────────
    AssetDefinition("SPY",   MarketType.stock, "S&P 500 ETF (SPDR)"),
    AssetDefinition("QQQ",   MarketType.stock, "NASDAQ 100 ETF (Invesco)"),
    AssetDefinition("DIA",   MarketType.stock, "Dow Jones ETF (SPDR)"),
    AssetDefinition("IWM",   MarketType.stock, "Russell 2000 ETF"),
    AssetDefinition("VTI",   MarketType.stock, "Vanguard Total Market ETF"),
    AssetDefinition("VOO",   MarketType.stock, "Vanguard S&P 500 ETF"),
    AssetDefinition("GLD",   MarketType.stock, "SPDR Gold Shares ETF"),
    AssetDefinition("SLV",   MarketType.stock, "iShares Silver Trust ETF"),
    AssetDefinition("USO",   MarketType.stock, "United States Oil Fund ETF"),
    AssetDefinition("TLT",   MarketType.stock, "iShares 20+ Year Treasury ETF"),
    AssetDefinition("XLF",   MarketType.stock, "Financial Select Sector ETF"),
    AssetDefinition("XLK",   MarketType.stock, "Technology Select Sector ETF"),
    AssetDefinition("XLE",   MarketType.stock, "Energy Select Sector ETF"),
    AssetDefinition("XLV",   MarketType.stock, "Health Care Select Sector ETF"),
    AssetDefinition("ARKK",  MarketType.stock, "ARK Innovation ETF"),
    AssetDefinition("ARKG",  MarketType.stock, "ARK Genomic Revolution ETF"),
    AssetDefinition("ARKW",  MarketType.stock, "ARK Next Generation Internet ETF"),
    AssetDefinition("SQQQ",  MarketType.stock, "ProShares UltraPro Short QQQ"),
    AssetDefinition("SPXU",  MarketType.stock, "ProShares UltraPro Short S&P500"),
    AssetDefinition("TQQQ",  MarketType.stock, "ProShares UltraPro QQQ (3x Bull)"),
]

_ASSET_BY_SYMBOL = {asset.symbol.upper(): asset for asset in DEFAULT_ASSETS}


def get_asset(symbol: str) -> AssetDefinition | None:
    return _ASSET_BY_SYMBOL.get(symbol.upper())


def list_assets(market: MarketType | None = None) -> list[AssetDefinition]:
    if market is None:
        return list(DEFAULT_ASSETS)
    return [asset for asset in DEFAULT_ASSETS if asset.market_type == market]
