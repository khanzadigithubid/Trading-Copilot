# ⚙️ Services

Business logic layer — all the heavy lifting happens here.

## Files

### `claude_client.py`
AI provider client. Tries providers in order:
1. Anthropic Claude (if key set)
2. OpenRouter free models (if key set)
3. Rule-based fallback (always works)

Key functions:
- `ask_claude(prompt)` — Send any prompt to AI
- `generate_ai_signal(symbol, price, indicators, ...)` — Generate trading signal

---

### `signal_engine.py`
Generates and caches AI trading signals.

- Fetches live price + 1 month history
- Calculates technical indicators (RSI, MACD, MA)
- Calls AI for signal with reasoning
- Caches result for 15 minutes (avoids duplicate API calls)

---

### `chat_service.py`
Handles market chat questions.

- Extracts asset symbols from user question
- Fetches live prices + signals for context
- Sends context + question to AI
- Returns natural language answer

---

### `paper_trading.py`
Manages virtual paper trades.

- Open trade: fetches live price, saves to DB
- Close trade: fetches live price, calculates P&L
- List trades: returns all trades with P&L calculation

---

### `backtest_engine.py`
Runs 5 trading strategy backtests on historical data.

| Strategy | Entry Signal | Exit Signal |
|---|---|---|
| RSI + MACD | RSI < 35 + MACD cross | RSI > 65 or MACD cross |
| Bollinger Bands | Price < lower band | Price > middle band |
| EMA Crossover | Fast EMA crosses above slow | Fast EMA crosses below slow |
| SuperTrend | Direction flips bullish | Direction flips bearish |
| Mean Reversion | Z-score < -2 | Z-score returns to 0 |

---

### `risk_manager.py`
Calculates position sizing and risk metrics.

Formula: `position_size = (capital × risk%) / (entry - stop_loss)`

Also calculates:
- Daily trade count vs limit
- Drawdown percentage
- Total P&L
- Overtrading alerts

---

### `indicators.py`
Technical indicator calculations using pandas.

- `_rsi(series, period=14)` — Relative Strength Index
- `_ema(series, span)` — Exponential Moving Average
- `calculate_indicators(bars)` — Returns RSI, MACD, MA50, MA200
- `summarize_price_action(bars)` — Text summary of recent price movement

---

### `market_data/`
Market data fetching with automatic fallback.

```
aggregator.py           ← Use this in your code
    ↓
providers.py            ← Real APIs (Binance, TwelveData, AlphaVantage)
    ↓ (if API fails)
mock_provider.py        ← Deterministic fake data (always works)
```

**catalog.py** — List of all 27 supported assets with their symbols and provider mappings.

---

### `seed.py`
Runs once on startup — adds all 27 assets to the database if not already there. Uses upsert logic so new assets added to catalog are picked up on restart.
