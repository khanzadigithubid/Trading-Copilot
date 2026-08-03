# 🤖 AI Trading Copilot

> The AI-powered trading platform that doesn't just show you signals — it explains them.
> Free for everyone. Forever.

**🌐 Live App:** https://kw-trading-copilot.vercel.app  
**⚙️ Backend API:** https://trading-copilot-api-okr7.onrender.com/docs  
**💻 GitHub:** https://github.com/khanzadigithubid/Trading-Copilot

---

## 🚀 What Makes This Different

Every trading app shows you **WHAT**.

→ RSI: 34.2 · MACD crossover · Signal detected

**This app tells you WHY.**

→ *"RSI at 34.2 suggests oversold conditions. MACD is crossing above its signal line indicating bullish momentum. Price action over last 20 candles moved down 2.1% — a reversal setup is forming."*

Bloomberg Terminal charges $24,000/year for this level of insight.  
**This is free.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Explainable AI Signals** | BUY/SELL/HOLD with full plain-English reasoning — not just numbers |
| 📈 **TradingView Charts** | Professional candlestick charts with volume, signal markers, 4 timeframe tabs |
| 🕐 **Multi-Timeframe Analysis** | 1D + 1W + 1M signals combined into one weighted verdict |
| 🌡️ **Sentiment Heatmap** | Market mood across all 27 assets from news + price action |
| 👥 **Community Signals** | Share trade ideas, vote on others' analysis, see collective consensus |
| 📚 **AI Trade Journal** | Every closed trade gets automatic AI coaching — what you did right, what to improve |
| 📊 **Portfolio Analytics** | Equity curve, Sharpe ratio, profit factor, max drawdown, win/loss streaks |
| 🔔 **Price Alerts** | Set price-above or price-below alerts — auto-checked against live prices |
| ⚡ **5 Backtest Strategies** | RSI+MACD, Bollinger Bands, EMA Crossover, SuperTrend, Mean Reversion |
| 💬 **Market Chat (AI)** | Ask anything in plain language — AI answers using live market data |
| 📐 **Risk Manager** | Position sizing calculator based on your capital and risk tolerance |
| 📰 **News Feed** | Real-time market news filtered by asset (powered by NewsAPI) |
| 🏆 **Leaderboard** | Top traders ranked by signals, votes, and paper trading performance |
| 📱 **PWA — Install on Phone** | Add to home screen, works offline, no app store needed |
| 🔐 **Admin Dashboard** | Real-time user stats, activity metrics, top assets (admin only) |
| 📬 **Contact Form** | Web3Forms powered — no backend required, free, reliable email delivery |
| 👤 **User Avatar in Navbar** | Professional dashboard navbar shows user initial + username |
| 📞 **Phone Field with Country Code** | Contact form includes country flag + dial code selector (20 countries) |

---

## 📊 27 Markets — All Real Live Data

| Market | Assets | Data Source |
|---|---|---|
| **Crypto** | BTC, ETH, SOL, BNB, XRP, ADA, DOGE | KuCoin API |
| **Forex** | EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD | TwelveData API |
| **Commodities** | Gold (XAU), Silver (XAG), Oil (WTI) | TwelveData API |
| **Stocks** | AAPL, MSFT, TSLA, GOOGL, AMZN, NVDA, META | Polygon.io API |
| **Indices** | S&P 500 (SPY), NASDAQ (QQQ), Dow Jones (DIA) | Polygon.io API |

---

## 🌐 Live Pages (19 Total)

| Page | URL |
|---|---|
| 🏠 Home / Landing | `/` |
| 🌍 Markets Overview | `/markets` |
| ₿ Cryptocurrency | `/markets/crypto` |
| 💱 Forex | `/markets/forex` |
| 🪙 Commodities | `/markets/commodities` |
| 🏦 Indices | `/markets/indices` |
| 📈 Stocks | `/markets/stocks` |
| 📖 Learn Trading | `/learn` |
| 📰 News Feed | `/news` |
| 🏆 Leaderboard | `/leaderboard` |
| ℹ️ About | `/about` |
| 📬 Contact | `/contact` |
| 🔒 Privacy Policy | `/privacy` |
| 📜 Terms of Service | `/terms` |
| 📊 Dashboard | `/dashboard` |
| 🔐 Admin Panel | `/admin` |
| 🔑 Login | `/login` |
| 📝 Register | `/register` |
| 📴 Offline | `/offline` |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **TradingView Lightweight Charts v5** — Professional candlestick charts
- **Recharts** — Portfolio equity curve charts
- **NextAuth.js** — JWT authentication
- **Web3Forms** — Contact form email (free, no backend needed)
- **Vercel Analytics** — Page views, visitors, countries

### Backend
- **FastAPI** — Python async web framework
- **SQLAlchemy** — Database ORM
- **PostgreSQL (Neon)** — Cloud database
- **Pydantic** — Data validation
- **httpx** — Async HTTP client

### AI & Data Sources
- **OpenRouter (Gemma 4 free)** — AI signals, chat, trade journal
- **Anthropic Claude** — Premium AI fallback (optional)
- **KuCoin API** — Real crypto prices (no key needed)
- **TwelveData API** — Real forex + commodity prices
- **Polygon.io API** — Real US stock + index prices
- **NewsAPI** — Real market news headlines

### Deployment
- **Vercel** — Frontend (free tier)
- **Render** — Backend (free tier)
- **Neon** — PostgreSQL database (free tier)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/khanzadigithubid/Trading-Copilot.git
cd Trading-Copilot
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Backend Environment Variables
Create `backend/.env`:
```env
# Database
DATABASE_URL=sqlite:///./trading_copilot.db

# Security
SECRET_KEY=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000

# AI (get free key at openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free

# Market Data
TWELVE_DATA_API_KEY=your-key     # twelvedata.com
POLYGON_API_KEY=your-key         # polygon.io
NEWS_API_KEY=your-key            # newsapi.org

# Admin (your email to access /admin)
ADMIN_EMAIL=your@email.com
```

### 4. Run Backend
```bash
uvicorn app.main:app --reload --port 8000
```
API: http://localhost:8000 | Docs: http://localhost:8000/docs

### 5. Frontend Setup
```bash
cd frontend
npm install
```

### 6. Frontend Environment Variables
Create `frontend/.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-32-char-string
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 7. Run Frontend
```bash
npm run dev
```
App: http://localhost:3000

---

## 🌐 Deployment

### Backend → Render.com (Free)
1. Go to https://render.com → New Web Service
2. Connect `Trading-Copilot` GitHub repo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (see `.env.example`)
7. Deploy!

### Frontend → Vercel (Free)
1. Go to https://vercel.com → Import repo
2. Root Directory: `frontend`
3. Add environment variables:
   - `NEXTAUTH_URL` = your Vercel URL
   - `NEXTAUTH_SECRET` = random 32-char string
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Deploy!

> **Contact Form:** Uses [Web3Forms](https://web3forms.com) — no additional env vars needed for contact form. Access key is embedded in frontend code.

---

## 📁 Project Structure

```
Trading-Copilot/
│
├── backend/                        # FastAPI Python backend
│   ├── app/
│   │   ├── core/                   # Config, database, security
│   │   │   ├── config.py           # All environment settings
│   │   │   ├── database.py         # SQLAlchemy engine + session
│   │   │   └── security.py         # JWT creation + verification
│   │   ├── models/                 # Database tables (SQLAlchemy)
│   │   │   ├── user.py             # User accounts
│   │   │   ├── trade.py            # Paper trades
│   │   │   ├── alert.py            # Price alerts
│   │   │   ├── signal.py           # Cached AI signals
│   │   │   ├── asset.py            # 27 market assets
│   │   │   ├── community_signal.py # Community trade ideas
│   │   │   └── sentiment_log.py    # Sentiment history
│   │   ├── routers/                # API endpoint handlers (20+ routers)
│   │   ├── schemas/                # Pydantic request/response shapes
│   │   └── services/
│   │       ├── market_data/        # Price providers (KuCoin, Polygon, etc.)
│   │       ├── claude_client.py    # AI provider (OpenRouter + Claude)
│   │       ├── backtest_engine.py  # 5 backtest strategies
│   │       ├── chat_service.py     # Market chat AI
│   │       ├── paper_trading.py    # Virtual trade management
│   │       └── risk_manager.py     # Position sizing + risk metrics
│   ├── .env.example                # Environment variables template
│   └── requirements.txt
│
├── frontend/                       # Next.js 14 frontend
│   ├── src/
│   │   ├── app/                    # 19 pages (Next.js App Router)
│   │   │   ├── dashboard/          # Main trading dashboard
│   │   │   ├── markets/            # 5 market category pages
│   │   │   ├── contact/            # Contact form (Web3Forms)
│   │   │   ├── learn/              # Trading education
│   │   │   ├── news/               # Market news feed
│   │   │   └── leaderboard/        # Top traders
│   │   ├── components/             # 15+ React components
│   │   │   ├── AssetDashboard      # 27 assets table
│   │   │   ├── SignalPanel         # AI signal display
│   │   │   ├── CandlestickChart    # TradingView chart
│   │   │   ├── PaperTradingPanel   # Virtual trading
│   │   │   ├── PortfolioPanel      # Analytics + equity curve
│   │   │   ├── BacktestPanel       # Strategy backtester
│   │   │   ├── ChatPanel           # AI market chat
│   │   │   └── ...more
│   │   ├── lib/                    # API call functions + auth config
│   │   └── types/                  # TypeScript type definitions
│   └── public/                     # PWA icons, manifest, service worker
│
├── docker-compose.yml              # Local Docker setup
└── README.md
```

---

## 🔌 API Endpoints (20+)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login + get JWT token |
| GET | `/auth/me` | Get current user info |
| POST | `/auth/refresh` | Refresh JWT token |
| GET | `/assets` | List all 27 assets |
| GET | `/assets/{symbol}/price` | Live price |
| GET | `/assets/{symbol}/history` | OHLCV chart data |
| GET | `/signals/{symbol}` | AI trading signal |
| GET | `/signals/{symbol}/mtf` | Multi-timeframe signal |
| POST | `/backtest/run` | Run backtest strategy |
| POST | `/chat/query` | Market chat AI |
| GET | `/portfolio/stats` | Portfolio analytics |
| GET | `/journal` | AI trade journal entries |
| GET | `/sentiment` | Sentiment heatmap data |
| GET | `/news` | News feed |
| GET | `/leaderboard` | Top traders ranking |
| GET | `/community/feed` | Community signals |
| POST | `/community/{id}/vote` | Vote on a signal |
| GET | `/alerts` | Price alerts list |
| POST | `/contact` | Contact form (logs only) |
| GET | `/admin/stats` | Admin analytics (protected) |
| WS | `/ws/prices` | Live WebSocket price stream |

Full interactive docs: https://trading-copilot-api-okr7.onrender.com/docs

---

## 🤖 AI Provider Priority

```
1. Anthropic Claude    (if ANTHROPIC_API_KEY set)
         ↓ fallback
2. OpenRouter Gemma    (if OPENROUTER_API_KEY set) ← FREE
         ↓ fallback
3. Rule-based signals  (always works — no key needed)
```

**Free OpenRouter models that work:**
- `google/gemma-4-26b-a4b-it:free`
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`

Get free key: https://openrouter.ai/keys

---

## 📊 Market Data Provider Priority

```
Crypto:  KuCoin → CoinGecko → Mock
Forex:   TwelveData → ExchangeRate → Mock
Stocks:  Polygon.io → Yahoo Finance → Mock
```

No API key needed for KuCoin (crypto) — works out of the box.

---

## 📬 Contact Form

The contact form uses **[Web3Forms](https://web3forms.com)** — a free, reliable email service that works directly from the browser with no backend required.

- ✅ Free — 250 submissions/month
- ✅ No backend SMTP setup needed
- ✅ Spam protection built-in (honeypot)
- ✅ Phone field with country flag + dial code (20 countries)
- ✅ Emails delivered to `memonbisma22@gmail.com`

---

## ⚠️ Disclaimer

This platform is **for educational purposes only.**

- Does NOT execute real trades
- AI signals are NOT financial advice
- Paper trading uses virtual money only
- Past performance does NOT guarantee future results
- Always do your own research before investing

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👩‍💻 Built By

**Khanzadi** — Full Stack Developer  
- 🌐 Live App: https://kw-trading-copilot.vercel.app  
- 💻 GitHub: https://github.com/khanzadigithubid  
- 📬 Contact: memonbisma22@gmail.com

---

*If this project helped you, please give it a ⭐ on GitHub!*

*For educational purposes only · Not financial advice*
