# 🤖 AI Trading Copilot

> A full-stack AI-powered trading platform for Forex, Crypto, Stocks, Commodities & Indices — completely free.

**Live Demo:** https://kw-trading-copilot.vercel.app  
**Backend API:** https://trading-copilot-api-okr7.onrender.com/docs

---

## 📌 What Is This?

AI Trading Copilot is a trading assistant that helps you understand markets — not just show you numbers.

Most trading apps say **"BUY"** or **"SELL"** — this app tells you **WHY**.

Every signal comes with a plain-English explanation. Every trade you close gets automatic AI coaching feedback. All free.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Signals** | BUY/SELL/HOLD with full reasoning in plain English |
| 📈 **Live Charts** | TradingView candlestick charts with volume & signal markers |
| 🕐 **Multi-Timeframe** | 1D + 1W + 1M signals combined into one verdict |
| 🌡️ **Sentiment Heatmap** | Market mood across all 27 assets at a glance |
| 👥 **Community Signals** | Share trade ideas & vote on others' analysis |
| 📚 **AI Trade Journal** | Auto coaching feedback for every closed trade |
| 📊 **Portfolio Analytics** | Sharpe ratio, equity curve, drawdown, win streaks |
| 🔔 **Price Alerts** | Get notified when any asset crosses your target |
| ⚡ **5 Backtest Strategies** | Test strategies on historical data before trading |
| 💬 **Market Chat** | Ask anything in plain language — AI answers |
| 📐 **Risk Manager** | Position sizing calculator based on your capital |
| 📱 **Mobile PWA** | Install on phone, works offline |

---

## 📊 Markets Covered (27 Total)

| Market | Assets |
|---|---|
| **Forex** | EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD |
| **Crypto** | BTC, ETH, SOL, BNB, XRP, ADA, DOGE |
| **Stocks** | AAPL, MSFT, TSLA, GOOGL, AMZN, NVDA, META |
| **Commodities** | Gold (XAU), Silver (XAG), Oil (WTI) |
| **Indices** | S&P 500 (SPY), NASDAQ (QQQ), Dow Jones (DIA) |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **TradingView Lightweight Charts v5** — Candlestick charts
- **Recharts** — Portfolio equity curve
- **NextAuth.js** — Authentication

### Backend
- **FastAPI** — Python web framework
- **SQLAlchemy** — Database ORM
- **PostgreSQL** — Database (Neon cloud)
- **Pydantic** — Data validation
- **httpx** — HTTP client for API calls

### AI & Data
- **OpenRouter** — Free AI models (Gemma, Llama)
- **Anthropic Claude** — Premium AI (optional)
- **Binance API** — Crypto prices
- **TwelveData API** — Forex prices
- **Alpha Vantage** — Stock prices

### Deployment
- **Vercel** — Frontend hosting (free)
- **Render** — Backend hosting (free)
- **Neon** — PostgreSQL database (free)

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
Create `backend/.env` file:
```env
DATABASE_URL=sqlite:///./trading_copilot.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
```

Get free OpenRouter key at: https://openrouter.ai/keys

### 4. Run Backend
```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### 5. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 6. Frontend Environment Variables
Create `frontend/.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string-here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 7. Run Frontend
```bash
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🌐 Deployment

### Backend → Render.com (Free)
1. Go to https://render.com
2. New → Web Service → Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy!

### Frontend → Vercel (Free)
1. Go to https://vercel.com
2. Import GitHub repo
3. Root Directory: `frontend`
4. Add environment variables:
   - `NEXTAUTH_URL` = your Vercel URL
   - `NEXTAUTH_SECRET` = random string
   - `NEXT_PUBLIC_API_URL` = your Render URL
5. Deploy!

---

## 📁 Project Structure

```
Trading-Copilot/
│
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── core/               # Config, database, security
│   │   ├── models/             # Database models
│   │   ├── routers/            # API endpoints
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic & AI
│   │   └── main.py             # App entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # Pages (Next.js App Router)
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API functions
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static files (icons, PWA)
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| GET | `/assets` | List all 27 assets |
| GET | `/assets/{symbol}/price` | Live price |
| GET | `/assets/{symbol}/history` | OHLCV history |
| GET | `/signals/{symbol}` | AI trading signal |
| GET | `/signals/{symbol}/mtf` | Multi-timeframe signal |
| POST | `/trades/paper/open` | Open paper trade |
| POST | `/trades/paper/{id}/close` | Close paper trade |
| GET | `/portfolio/stats` | Portfolio analytics |
| GET | `/journal` | AI trade journal |
| POST | `/chat/query` | Market chat AI |
| POST | `/backtest/run` | Run backtest |
| GET | `/sentiment` | Sentiment heatmap |
| GET | `/community/feed` | Community signals |
| POST | `/community/{id}/vote` | Vote on signal |
| GET | `/alerts` | Price alerts |
| WS | `/ws/prices` | Live price WebSocket |

Full interactive docs: https://trading-copilot-api-okr7.onrender.com/docs

---

## 🤖 AI Providers

The app works with multiple AI providers — priority order:

```
1. Anthropic Claude (if ANTHROPIC_API_KEY set)
      ↓ fallback
2. OpenRouter free models (if OPENROUTER_API_KEY set)
      ↓ fallback  
3. Rule-based signals (always works — no key needed)
```

**Free OpenRouter models that work:**
- `google/gemma-4-26b-a4b-it:free`
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`

Get your free key: https://openrouter.ai/keys

---

## ⚠️ Disclaimer

This platform is **for educational purposes only**.

- It does NOT execute real trades
- AI signals are NOT financial advice
- Past backtest performance does NOT guarantee future results
- Always do your own research before investing

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👩‍💻 Built By

**Khanzadi** — Full Stack Developer  
GitHub: https://github.com/khanzadigithubid  
Live App: https://kw-trading-copilot.vercel.app

---

*If this project helped you, please give it a ⭐ on GitHub!*
