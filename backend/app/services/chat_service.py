from app.core.config import settings
from app.schemas.chat import ChatQueryResponse
from app.services.claude_client import ask_claude
from app.services.market_data import aggregator
from app.services.market_data.catalog import DEFAULT_ASSETS, get_asset
from app.services.signal_engine import signal_engine
from sqlalchemy.orm import Session


SYMBOL_ALIASES: dict[str, str] = {
    # Forex
    "EUR/USD": "EURUSD",
    "GBP/USD": "GBPUSD",
    "USD/JPY": "USDJPY",
    "AUD/USD": "AUDUSD",
    "USD/CAD": "USDCAD",
    "USD/CHF": "USDCHF",
    "NZD/USD": "NZDUSD",
    "EURO": "EURUSD",
    "POUND": "GBPUSD",
    "YEN": "USDJPY",
    # Crypto
    "BTC": "BTCUSDT",
    "BITCOIN": "BTCUSDT",
    "ETH": "ETHUSDT",
    "ETHEREUM": "ETHUSDT",
    "SOL": "SOLUSDT",
    "SOLANA": "SOLUSDT",
    "BNB": "BNBUSDT",
    "XRP": "XRPUSDT",
    "RIPPLE": "XRPUSDT",
    "ADA": "ADAUSDT",
    "CARDANO": "ADAUSDT",
    "DOGE": "DOGEUSDT",
    "DOGECOIN": "DOGEUSDT",
    # Commodities
    "GOLD": "XAUUSD",
    "XAU": "XAUUSD",
    "XAUUSD": "XAUUSD",
    "SILVER": "XAGUSD",
    "XAG": "XAGUSD",
    "OIL": "USOIL",
    "CRUDE": "USOIL",
    "WTI": "USOIL",
    "CRUDE OIL": "USOIL",
    # Stocks
    "APPLE": "AAPL",
    "MICROSOFT": "MSFT",
    "TESLA": "TSLA",
    "NVIDIA": "NVDA",
    "GOOGLE": "GOOGL",
    "ALPHABET": "GOOGL",
    "AMAZON": "AMZN",
    "META": "META",
    "FACEBOOK": "META",
    # Indices
    "S&P": "SPY",
    "S&P 500": "SPY",
    "SP500": "SPY",
    "NASDAQ": "QQQ",
    "DOW": "DIA",
    "DOW JONES": "DIA",
}

KNOWN_SYMBOLS = {asset.symbol for asset in DEFAULT_ASSETS}


class ChatService:
    async def answer_query(self, query: str, db: Session, symbol: str | None = None) -> ChatQueryResponse:
        symbols = self._extract_symbols(query, symbol)
        context = await self._build_market_context(symbols, db)

        if settings.has_ai:
            try:
                response = await ask_claude(
                    f"""You are an AI trading assistant for a multi-market dashboard (Forex, Crypto, Stocks).
IMPORTANT: Detect the language of the user's question and reply in the SAME language.
If user asks in Urdu — reply in Urdu.
If user asks in Hindi — reply in Hindi.
If user asks in Arabic — reply in Arabic.
If user asks in English — reply in English.
Always match the user's language exactly.

Answer the user's question clearly and concisely.
Include relevant numbers from the context. Do not give definitive financial advice — frame as educational analysis.
If data is missing, say so honestly.

Market Context:
{context}

User Question: {query}""",
                    max_tokens=800,
                )
                ai_source = "openrouter" if settings.openrouter_api_key and not settings.anthropic_api_key else "claude"
                return ChatQueryResponse(
                    query=query,
                    response=response.strip(),
                    symbols_used=symbols,
                    source=ai_source,
                )
            except Exception:
                pass

        fallback = self._fallback_response(query, symbols, context)
        return ChatQueryResponse(
            query=query,
            response=fallback,
            symbols_used=symbols,
            source="rules",
        )

    def _extract_symbols(self, query: str, explicit: str | None) -> list[str]:
        found: list[str] = []
        upper_query = query.upper()

        if explicit:
            asset = get_asset(explicit)
            if asset:
                found.append(asset.symbol)

        # Check all aliases (sorted by length desc — match longest first)
        for alias in sorted(SYMBOL_ALIASES.keys(), key=len, reverse=True):
            if alias.upper() in upper_query:
                symbol = SYMBOL_ALIASES[alias]
                if symbol not in found:
                    found.append(symbol)

        # Check known symbols directly
        for symbol in KNOWN_SYMBOLS:
            if symbol.upper() in upper_query.replace("/", "") and symbol not in found:
                found.append(symbol)

        # Smart defaults based on query keywords
        if not found:
            if any(w in upper_query for w in ["MARKET", "TREND", "BUY", "SELL", "TRADE", "INVEST"]):
                found = ["BTCUSDT", "XAUUSD", "EURUSD"]
            else:
                found = ["BTCUSDT", "EURUSD", "XAUUSD"]

        return found[:3]

    async def _build_market_context(self, symbols: list[str], db: Session) -> str:
        blocks: list[str] = []
        for symbol in symbols:
            try:
                price = await aggregator.get_price(symbol)
                signal = await signal_engine.get_latest_signal(symbol, db)
                blocks.append(
                    f"- {symbol} ({price.market_type.value}): price={price.price}, "
                    f"change={price.change_percent}%, signal={signal.signal.value}, "
                    f"confidence={signal.confidence}%, risk={signal.risk_level.value}. "
                    f"Reasoning: {signal.reasoning[:200]}"
                )
            except Exception:
                blocks.append(f"- {symbol}: data unavailable")
        return "\n".join(blocks)

    def _fallback_response(self, query: str, symbols: list[str], context: str) -> str:
        symbol_text = ", ".join(symbols)
        return (
            f"Based on available market data for {symbol_text}:\n\n{context}\n\n"
            f'Regarding your question ("{query.strip()}"): '
            "The data above reflects current prices and latest AI-generated signals."
        )


chat_service = ChatService()
