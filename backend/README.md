# 🔧 Backend — AI Trading Copilot

FastAPI + Python backend for the AI Trading Copilot platform.

## Quick Start

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate (Windows)
.venv\Scripts\activate

# 3. Install packages
pip install -r requirements.txt

# 4. Create .env file (copy from .env.example)
copy .env.example .env

# 5. Run server
uvicorn app.main:app --reload --port 8000
```

API runs at: **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

---

## 📁 Folder Structure

```
backend/
├── app/
│   ├── core/                   # Core configuration
│   │   ├── config.py           # All environment variables & settings
│   │   ├── database.py         # Database connection (SQLAlchemy)
│   │   └── security.py         # JWT token creation & verification
│   │
│   ├── models/                 # Database tables (SQLAlchemy ORM)
│   │   ├── user.py             # User account table
│   │   ├── asset.py            # Trading assets table
│   │   ├── trade.py            # Paper trades table
│   │   ├── signal.py           # AI signals history table
│   │   ├── alert.py            # Price alerts table
│   │   ├── community_signal.py # Community signals + votes tables
│   │   └── sentiment_log.py    # Sentiment scores cache table
│   │
│   ├── schemas/                # Request/Response data shapes (Pydantic)
│   │   ├── auth.py             # Login, Register request/response
│   │   ├── asset.py            # Asset, Price, OHLCV, History shapes
│   │   ├── signal.py           # Signal response shape
│   │   ├── trade.py            # Trade open/close shapes
│   │   ├── backtest.py         # Backtest request/response
│   │   ├── risk.py             # Risk calculation shapes
│   │   ├── chat.py             # Chat query/response
│   │   ├── alert.py            # Price alert shapes
│   │   ├── portfolio.py        # Portfolio stats shapes
│   │   ├── journal.py          # Trade journal shapes
│   │   ├── mtf.py              # Multi-timeframe signal shapes
│   │   └── community.py        # Community signal shapes (in routers)
│   │
│   ├── routers/                # API endpoints
│   │   ├── auth.py             # POST /auth/register, /auth/login, GET /auth/me
│   │   ├── assets.py           # GET /assets, /assets/{symbol}/price, /history
│   │   ├── signals.py          # GET /signals/{symbol}, /signals/{symbol}/mtf
│   │   ├── trades.py           # POST /trades/paper/open, /close, GET /trades/me
│   │   ├── risk.py             # GET /risk/me, POST /risk/position-size
│   │   ├── backtest.py         # POST /backtest/run
│   │   ├── chat.py             # POST /chat/query
│   │   ├── alerts.py           # CRUD /alerts, POST /alerts/check
│   │   ├── portfolio.py        # GET /portfolio/stats
│   │   ├── journal.py          # GET /journal
│   │   ├── sentiment.py        # GET /sentiment
│   │   ├── community.py        # GET /community/feed, POST /community, /vote
│   │   ├── mtf.py              # GET /signals/{symbol}/mtf
│   │   └── ws.py               # WebSocket /ws/prices
│   │
│   ├── services/               # Business logic
│   │   ├── auth_service.py     # User registration, login, current user
│   │   ├── signal_engine.py    # AI signal generation & caching
│   │   ├── claude_client.py    # OpenRouter + Anthropic AI client
│   │   ├── chat_service.py     # Market chat with AI
│   │   ├── paper_trading.py    # Open/close paper trades, P&L
│   │   ├── risk_manager.py     # Risk calculations, position sizing
│   │   ├── backtest_engine.py  # 5 backtest strategies
│   │   ├── indicators.py       # RSI, MACD, EMA, Bollinger calculations
│   │   ├── seed.py             # Database seeding (27 assets)
│   │   └── market_data/        # Market data providers
│   │       ├── aggregator.py   # Routes requests to correct provider
│   │       ├── catalog.py      # 27 assets definition list
│   │       ├── providers.py    # Binance, TwelveData, AlphaVantage
│   │       └── mock_provider.py# Deterministic mock data (fallback)
│   │
│   └── main.py                 # FastAPI app, middleware, routers setup
│
├── .env                        # Your secrets (git ignored)
├── .env.example                # Example env file (safe to commit)
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker container config
└── railway.toml                # Railway deployment config
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SECRET_KEY` | ✅ | JWT signing secret (min 32 chars) |
| `CORS_ORIGINS` | ✅ | Frontend URL (comma separated) |
| `OPENROUTER_API_KEY` | ⭐ | Free AI — get at openrouter.ai/keys |
| `OPENROUTER_MODEL` | ⭐ | AI model name (default: gemma free) |
| `ANTHROPIC_API_KEY` | Optional | Claude AI (paid) |
| `TWELVE_DATA_API_KEY` | Optional | Forex live prices |
| `ALPHA_VANTAGE_API_KEY` | Optional | Stock live prices |
| `NEWS_API_KEY` | Optional | News sentiment |

---

## 🤖 AI Flow

```
Request comes in
      ↓
Anthropic key set? → Use Claude Sonnet
      ↓ no
OpenRouter key set? → Use free model (Gemma/Llama)
      ↓ no
Use rule-based signals (always works)
```

---

## 📊 Backtest Strategies

| Strategy | Logic |
|---|---|
| `rsi_macd` | Buy when RSI < 35 + MACD bullish cross |
| `bollinger_bands` | Buy at lower band, sell at upper band |
| `ema_crossover` | Buy on EMA 9/21 bullish cross |
| `supertrend` | ATR-based trend following |
| `mean_reversion` | Buy when Z-score < -2 |

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `users` | User accounts |
| `assets` | 27 trading assets |
| `trades` | Paper trades (open/closed) |
| `signals` | AI signal history (cached 15 min) |
| `price_alerts` | User price alerts |
| `community_signals` | Shared trade ideas |
| `community_votes` | Votes on community signals |
| `sentiment_logs` | Sentiment scores (cached 2 hours) |
