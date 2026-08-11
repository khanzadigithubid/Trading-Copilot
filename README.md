<div align="center">

# 🤖 AI Trading Copilot

**The AI-powered trading platform that doesn't just show signals — it explains them.**

[![Live App](https://img.shields.io/badge/Live%20App-kw--trading--copilot.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://kw-trading-copilot.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge&logo=render)](https://trading-copilot-api-okr7.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-khanzadigithubid-black?style=for-the-badge&logo=github)](https://github.com/khanzadigithubid/Trading-Copilot)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> 🎓 **For educational purposes only** · Paper trading · Not financial advice

</div>

---

## 💡 The Problem We Solve

Every trading app shows you **WHAT**:

```
RSI: 34.2  ·  MACD crossover  ·  Signal: BUY
```

**We tell you WHY:**

```
"RSI at 34.2 suggests oversold conditions. MACD is crossing above its signal
line indicating bullish momentum building. Price action down 2.1% over last
20 candles — a classic reversal setup is forming. Confidence: 78%"
```

> Bloomberg Terminal charges **$24,000/year** for this level of insight.
> **AI Trading Copilot is free. Forever.**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                          │
│                    Mobile / Desktop / PWA                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND  ·  Vercel (Edge Network)                 │
│                                                                 │
│   Next.js 14  ·  TypeScript  ·  Tailwind CSS                   │
│   NextAuth.js  ·  TradingView Charts  ·  Recharts               │
│                                                                 │
│   Pages: Home · Markets · Dashboard · Learn · News             │
│          Leaderboard · Contact · About · Auth                   │
│          Forgot Password · Reset Password                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │  REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND  ·  Render (Free Tier)                     │
│                                                                 │
│   FastAPI (Python)  ·  SQLAlchemy  ·  JWT Auth                 │
│   Pydantic  ·  httpx  ·  bcrypt                                 │
│                                                                 │
│   20+ API Routers: auth · signals · trades · portfolio         │
│   alerts · journal · backtest · chat · community               │
│   sentiment · news · leaderboard · contact · admin             │
└──────┬────────────────────┬───────────────────────┬────────────┘
       │                    │                        │
       ▼                    ▼                        ▼
┌─────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│  DATABASE   │   │    AI PROVIDERS  │   │   MARKET DATA APIs  │
│             │   │                  │   │                     │
│ PostgreSQL  │   │ OpenRouter Gemma │   │ KuCoin   (Crypto)   │
│ Neon Cloud  │   │ (Free — default) │   │ TwelveData (Forex)  │
│             │   │        ↓         │   │ Polygon.io (Stocks) │
│ Users       │   │ Anthropic Claude │   │ NewsAPI  (News)     │
│ Trades      │   │ (Paid — premium) │   │ Yahoo Finance       │
│ Signals     │   │        ↓         │   │ ExchangeRate API    │
│ Alerts      │   │ Rule-based       │   │                     │
│ Journal     │   │ (No key needed)  │   │                     │
└─────────────┘   └──────────────────┘   └─────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐     POST /auth/register      ┌──────────────┐
│  User    │ ────────────────────────────► │   Backend    │
│ Register │                               │  Create user │
└──────────┘ ◄──────────────────────────── │  Return JWT  │
                    JWT Token              └──────────────┘

┌──────────┐     POST /auth/login          ┌──────────────┐
│  User    │ ────────────────────────────► │   Backend    │
│  Login   │                               │ Verify pass  │
└──────────┘ ◄──────────────────────────── │  Return JWT  │
                    JWT Token              └──────────────┘

┌──────────┐   GET /dashboard (+ JWT)      ┌──────────────┐
│Protected │ ────────────────────────────► │   Backend    │
│  Route   │                               │ Validate JWT │
└──────────┘ ◄──────────────────────────── │  User data   │
                   Session data            └──────────────┘
```

---

## 🔑 Forgot Password Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User clicks "Forgot password?" on Login page               │
│                          │                                      │
│                          ▼                                      │
│  2. /forgot-password — Enter email address                      │
│                          │                                      │
│                          ▼                                      │
│  3. Backend generates secure token (expires in 1 hour)         │
│     Sends reset link to email via Web3Forms                     │
│                          │                                      │
│                          ▼                                      │
│  4. User receives email with link:                              │
│     https://kw-trading-copilot.vercel.app/reset-password?token=│
│                          │                                      │
│                          ▼                                      │
│  5. /reset-password — Enter new password + confirm             │
│                          │                                      │
│                          ▼                                      │
│  6. Backend verifies token → updates password → clears token   │
│                          │                                      │
│                          ▼                                      │
│  7. ✅ Redirect to /login — sign in with new password          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 27 Live Markets

```
┌─────────────────────────────────────────────────────────────┐
│                      ASSET CATEGORIES                       │
├────────────┬────────────┬──────────┬────────────┬──────────┤
│   CRYPTO   │   FOREX    │  STOCKS  │COMMODITIES │ INDICES  │
│  7 assets  │  7 pairs   │ 7 stocks │  3 assets  │ 3 index  │
├────────────┼────────────┼──────────┼────────────┼──────────┤
│ BTC/USDT   │ EUR/USD    │ AAPL     │ XAU (Gold) │ SPY      │
│ ETH/USDT   │ GBP/USD    │ MSFT     │ XAG (Silver│ QQQ      │
│ SOL/USDT   │ USD/JPY    │ TSLA     │ WTI (Oil)  │ DIA      │
│ BNB/USDT   │ AUD/USD    │ GOOGL    │            │          │
│ XRP/USDT   │ USD/CAD    │ AMZN     │            │          │
│ ADA/USDT   │ USD/CHF    │ NVDA     │            │          │
│ DOGE/USDT  │ NZD/USD    │ META     │            │          │
├────────────┼────────────┼──────────┼────────────┼──────────┤
│  KuCoin    │ TwelveData │ Polygon  │ TwelveData │ Polygon  │
│    API     │    API     │   API    │    API     │   API    │
└────────────┴────────────┴──────────┴────────────┴──────────┘
```

---

## 🤖 AI Signal Pipeline

```
User requests signal for BTCUSDT
            │
            ▼
┌───────────────────────┐
│  Fetch live market    │
│  data (price, OHLCV)  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Calculate technical  │
│  indicators:          │
│  RSI · MACD · BB      │
│  EMA · ATR · Volume   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐     ┌─────────────────┐
│  Send to AI provider  │────►│  OpenRouter      │
│  with full context    │     │  Gemma (Free)    │
└───────────┬───────────┘     └─────────────────┘
            │                 ┌─────────────────┐
            │  fallback  ────►│ Anthropic Claude │
            │                 │   (Premium)      │
            │                 └─────────────────┘
            │                 ┌─────────────────┐
            │  fallback  ────►│  Rule-based      │
            │                 │  (No key needed) │
            ▼                 └─────────────────┘
┌───────────────────────┐
│  AI Response:         │
│  · Direction: BUY     │
│  · Confidence: 78%    │
│  · Risk: Medium       │
│  · Full reasoning     │
│    in plain English   │
└───────────────────────┘
```

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🤖 **Explainable AI Signals** | BUY/SELL/HOLD with full plain-English reasoning |
| 2 | 📈 **TradingView Charts** | Professional candlesticks, volume, 4 timeframes |
| 3 | 🕐 **Multi-Timeframe Analysis** | 1D+1W+1M signals merged into one verdict |
| 4 | ⚡ **5 Backtest Strategies** | RSI+MACD, Bollinger, EMA, SuperTrend, Mean Rev |
| 5 | 📚 **AI Trade Journal** | Auto coaching after every trade |
| 6 | 📊 **Portfolio Analytics** | Equity curve, Sharpe ratio, max drawdown |
| 7 | 👥 **Community Signals** | Share ideas, vote, see collective consensus |
| 8 | 🔔 **Price Alerts** | Price-above / price-below on any asset |
| 9 | 📐 **Risk Manager** | Position sizing by capital + risk % |
| 10 | 💬 **AI Market Chat** | Ask anything, AI answers with live data |
| 11 | 🌡️ **Sentiment Heatmap** | Market mood across all 27 assets |
| 12 | 📰 **Live News Feed** | Real-time news filtered by asset |
| 13 | 🏆 **Leaderboard** | Top traders ranked by signals + P&L |
| 14 | 📱 **PWA — Offline** | Install on phone, works without internet |
| 15 | 🔐 **Forgot Password** | Secure email reset link (1 hour expiry) |
| 16 | 👤 **User Avatar** | Professional navbar with user initial |
| 17 | 📞 **Phone + Country Code** | Contact form with 20 country flags |
| 18 | 🛡️ **Admin Dashboard** | Real-time stats (admin only) |

---

## 🌐 All Pages (21 Total)

```
/                    → Landing page (public)
/login               → Sign in
/register            → Create account
/forgot-password     → Request reset link
/reset-password      → Set new password
/dashboard           → Main app (protected)
/markets             → All markets overview
/markets/crypto      → Cryptocurrency
/markets/forex       → Forex pairs
/markets/stocks      → US Stocks
/markets/commodities → Gold, Silver, Oil
/markets/indices     → S&P, NASDAQ, Dow
/learn               → Trading education
/news                → Market news
/leaderboard         → Top traders
/about               → About page
/contact             → Contact form
/privacy             → Privacy policy
/terms               → Terms of service
/admin               → Admin panel
/offline             → PWA offline page
```

---

## 🛠️ Tech Stack

### Frontend
```
Next.js 14 (App Router)    TypeScript         Tailwind CSS
NextAuth.js (JWT)          TradingView v5     Recharts
Web3Forms (email)          Vercel Analytics   PWA
```

### Backend
```
FastAPI (Python)    SQLAlchemy ORM     PostgreSQL (Neon)
Pydantic v2         bcrypt             python-jose (JWT)
httpx               secrets            smtplib
```

### Infrastructure
```
Vercel     → Frontend hosting (free)
Render     → Backend API (free)
Neon       → PostgreSQL cloud (free)
Web3Forms  → Contact + reset emails (free)
```

---

## 🚀 Local Development

### 1. Clone
```bash
git clone https://github.com/khanzadigithubid/Trading-Copilot.git
cd Trading-Copilot
```

### 2. Backend
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Backend `.env`
```env
DATABASE_URL=sqlite:///./trading_copilot.db
SECRET_KEY=your-32-char-secret-key
CORS_ORIGINS=http://localhost:3000

# Free AI (get key at openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free

# Market Data
TWELVE_DATA_API_KEY=your-key
POLYGON_API_KEY=your-key
NEWS_API_KEY=your-key

# Admin access
ADMIN_EMAIL=your@email.com

# Password reset emails
WEB3FORMS_KEY=your-key
FRONTEND_URL=http://localhost:3000
```

### 4. Run Backend
```bash
uvicorn app.main:app --reload --port 8000
# API Docs: http://localhost:8000/docs
```

### 5. Frontend
```bash
cd frontend
npm install
```

### 6. Frontend `.env.local`
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-32-char-string
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 7. Run Frontend
```bash
npm run dev
# App: http://localhost:3000
```

---

## 🌐 Deployment Guide

### Backend → Render
```
1. render.com → New Web Service
2. Connect GitHub repo
3. Root Directory: backend
4. Build: pip install -r requirements.txt
5. Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
6. Add env vars → Deploy
```

### Frontend → Vercel
```
1. vercel.com → Import repo
2. Root Directory: frontend
3. Add env vars:
   NEXTAUTH_URL         = https://your-app.vercel.app
   NEXTAUTH_SECRET      = random-32-char-string
   NEXT_PUBLIC_API_URL  = https://your-backend.onrender.com
4. Deploy
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Login + get JWT |
| `GET` | `/auth/me` | Current user info |
| `POST` | `/auth/refresh` | Refresh JWT token |
| `POST` | `/auth/forgot-password` | Send reset email |
| `POST` | `/auth/reset-password` | Set new password |
| `GET` | `/assets` | List 27 assets |
| `GET` | `/assets/{symbol}/price` | Live price |
| `GET` | `/assets/{symbol}/history` | OHLCV data |
| `GET` | `/signals/{symbol}` | AI signal |
| `GET` | `/signals/{symbol}/mtf` | Multi-timeframe |
| `POST` | `/backtest/run` | Run backtest |
| `POST` | `/chat/query` | AI market chat |
| `GET` | `/portfolio/stats` | Analytics |
| `GET` | `/journal` | Trade journal |
| `GET` | `/sentiment` | Sentiment data |
| `GET` | `/news` | News feed |
| `GET` | `/leaderboard` | Top traders |
| `GET` | `/community/feed` | Community signals |
| `POST` | `/contact` | Contact form |
| `GET` | `/admin/stats` | Admin analytics |
| `WS` | `/ws/prices` | Live prices |

> 📖 Full interactive docs: https://trading-copilot-api-okr7.onrender.com/docs

---

## 📁 Project Structure

```
Trading-Copilot/
│
├── 📁 backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py         # All settings + env vars
│   │   │   ├── database.py       # SQLAlchemy engine
│   │   │   └── security.py       # JWT + bcrypt
│   │   ├── models/
│   │   │   ├── user.py           # User + reset token
│   │   │   ├── trade.py          # Paper trades
│   │   │   ├── alert.py          # Price alerts
│   │   │   ├── signal.py         # Cached AI signals
│   │   │   ├── asset.py          # 27 market assets
│   │   │   ├── community_signal.py
│   │   │   └── sentiment_log.py
│   │   ├── routers/              # 20+ API endpoints
│   │   │   ├── auth.py           # Login/register/reset
│   │   │   ├── signals.py        # AI signals
│   │   │   ├── trades.py         # Paper trading
│   │   │   ├── portfolio.py      # Analytics
│   │   │   ├── backtest.py       # Strategy testing
│   │   │   ├── chat.py           # AI chat
│   │   │   ├── alerts.py         # Price alerts
│   │   │   ├── journal.py        # Trade journal
│   │   │   ├── community.py      # Social signals
│   │   │   ├── contact.py        # Contact form
│   │   │   └── admin.py          # Admin stats
│   │   └── services/
│   │       ├── market_data/      # KuCoin/Polygon/TwelveData
│   │       ├── claude_client.py  # AI provider wrapper
│   │       ├── backtest_engine.py
│   │       └── risk_manager.py
│   └── requirements.txt
│
└── 📁 frontend/
    ├── src/
    │   ├── app/                  # 21 pages
    │   │   ├── dashboard/        # Main trading app
    │   │   ├── markets/          # 5 market pages
    │   │   ├── forgot-password/  # Reset request
    │   │   ├── reset-password/   # Set new password
    │   │   ├── contact/          # Web3Forms contact
    │   │   └── ...
    │   ├── components/           # 15+ React components
    │   │   ├── AssetDashboard    # 27 assets table
    │   │   ├── SignalPanel       # AI signals
    │   │   ├── CandlestickChart  # TradingView chart
    │   │   ├── PaperTradingPanel # Virtual trading
    │   │   ├── PortfolioPanel    # Analytics
    │   │   ├── BacktestPanel     # Backtester
    │   │   ├── ChatPanel         # AI chat
    │   │   ├── ChatWidget        # Floating bubble
    │   │   └── MobileNav         # Mobile hamburger
    │   ├── lib/
    │   │   ├── auth.ts           # NextAuth config
    │   │   └── api.ts            # API fetch wrapper
    │   └── types/
    │       └── next-auth.d.ts    # Auth type defs
    └── public/                   # PWA icons + manifest
```

---

## ⚠️ Disclaimer

This platform is **for educational purposes only.**

- ❌ Does NOT execute real trades
- ❌ AI signals are NOT financial advice
- ❌ Past performance does NOT guarantee future results
- ✅ Paper trading uses virtual money only
- ✅ Always do your own research

---

## 📄 License

**MIT License** — free to use, modify, and distribute with attribution.

---

<div align="center">

## 👩‍💻 Built by Khanzadi

🌐 [Live App](https://kw-trading-copilot.vercel.app) &nbsp;·&nbsp;
💻 [GitHub](https://github.com/khanzadigithubid) &nbsp;·&nbsp;
📬 [Contact](mailto:memonbisma22@gmail.com)

**If this project helped you, please give it a ⭐ on GitHub!**

*For educational purposes only · Not financial advice*

</div>
