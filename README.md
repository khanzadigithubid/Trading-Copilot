# AI Trading Copilot

Multi-market (Forex + Crypto + Stocks) AI-powered trading assistant.

**Stack:** Next.js 14 · FastAPI · PostgreSQL · Redis · Claude API

> For educational purposes only. Not financial advice.

## Phase 1 ✅

- [x] Next.js frontend with TailwindCSS
- [x] FastAPI backend skeleton
- [x] PostgreSQL schema (users, assets, signals, trades, sentiment_logs)
- [x] JWT auth: register, login, `/auth/me`
- [x] NextAuth.js credentials provider wired to backend
- [x] Login / register / dashboard pages
- [x] Docker Compose for PostgreSQL + Redis

## Phase 2 ✅

- [x] Unified market data aggregator (Forex, Crypto, Stocks)
- [x] Binance (crypto), TwelveData (forex), Alpha Vantage (stocks) providers
- [x] Mock fallback when API keys are missing
- [x] Asset catalog seeded in PostgreSQL
- [x] REST: `GET /assets`, `/assets/{symbol}/price`, `/assets/{symbol}/history`
- [x] WebSocket live price stream at `/ws/prices`
- [x] Dashboard UI with market filters + live price table

## Phase 3 ✅

- [x] Technical indicators: RSI, MACD, MA50, MA200 (pandas)
- [x] Claude API signal generation with rule-based fallback
- [x] `GET /signals/{symbol}` and `/signals/{symbol}/history`
- [x] Signals stored in PostgreSQL (15-min cache)
- [x] Dashboard AI signal panel with indicators

## Phase 4 ✅

- [x] Position size calculator (fixed % risk model)
- [x] Overtrading detection (5 trades/day limit)
- [x] Drawdown alerts from trade history
- [x] `GET /risk/position-size`, `/risk/me`, `/risk/user-summary/{user_id}`
- [x] Natural language chat: `POST /chat/query`
- [x] Dashboard risk panel + chat interface

## Phase 5 (current) ✅

- [x] Paper trading: open/close virtual trades with live prices
- [x] `POST /trades/paper`, `GET /trades/me`, `POST /trades/{id}/close`
- [x] RSI + MACD backtesting engine
- [x] `POST /backtest/run` with win rate, return, drawdown stats
- [x] Dashboard paper trading + backtest panels

## Quick start

### 1. Start databases

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

## Environment variables

| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `DATABASE_URL` | PostgreSQL connection string |
| Backend | `SECRET_KEY` | JWT signing key |
| Backend | `ANTHROPIC_API_KEY` | Claude API for AI signals |
| Backend | `ALPHA_VANTAGE_API_KEY` | Stock market data |
| Backend | `TWELVE_DATA_API_KEY` | Forex market data |
| Frontend | `NEXTAUTH_SECRET` | NextAuth session secret |
| Frontend | `NEXT_PUBLIC_API_URL` | Backend URL (default `http://localhost:8000`) |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT |
| GET | `/auth/me` | Current user (Bearer token) |
| GET | `/assets` | List assets (`?market=forex\|crypto\|stock`) |
| GET | `/assets/{symbol}/price` | Latest price for symbol |
| GET | `/assets/{symbol}/history` | OHLCV history (`?range=1d\|1w\|1m`) |
| GET | `/signals/{symbol}` | Latest AI signal (`?refresh=true` to regenerate) |
| GET | `/signals/{symbol}/history` | Past signals for symbol |
| GET | `/risk/position-size` | Suggested position size (auth required) |
| GET | `/risk/me` | Current user risk summary (auth required) |
| GET | `/risk/user-summary/{user_id}` | User risk summary (own account only) |
| POST | `/chat/query` | Natural language market Q&A (auth required) |
| POST | `/trades/paper` | Open paper trade (auth required) |
| GET | `/trades/me` | List your paper trades (auth required) |
| POST | `/trades/{trade_id}/close` | Close paper trade at market price |
| POST | `/backtest/run` | Run RSI+MACD strategy backtest |
| WS | `/ws/prices` | Live price stream (subscribe with JSON) |
| GET | `/health` | Health check |

## Roadmap

| Phase | Focus |
|-------|-------|
| **1** | Auth + project setup ✅ |
| **2** | Market data (Alpha Vantage, TwelveData, Binance) + WebSockets ✅ |
| **3** | AI signal engine + sentiment ✅ |
| **4** | Risk manager + chat ✅ |
| **5** | Paper trading + backtesting ✅ |
| **6** | Polish + deploy |

## Project structure

```
AI Trading Copilot/
├── frontend/          # Next.js 14 (App Router)
├── backend/           # FastAPI
├── docker-compose.yml # PostgreSQL + Redis
└── README.md
```
