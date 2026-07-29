# 🎨 Frontend — AI Trading Copilot

Next.js 14 + TypeScript frontend for the AI Trading Copilot platform.

## Quick Start

```bash
# 1. Install packages
npm install

# 2. Create .env.local file
copy .env.local.example .env.local

# 3. Run development server
npm run dev
```

App runs at: **http://localhost:3000**

---

## 📁 Folder Structure

```
frontend/
├── public/                         # Static files
│   ├── manifest.json               # PWA manifest (app name, icons, colors)
│   ├── sw.js                       # Service worker (offline support)
│   ├── icon-192.png                # App icon (small)
│   ├── icon-512.png                # App icon (large)
│   └── apple-touch-icon.png       # iPhone home screen icon
│
├── src/
│   ├── app/                        # Pages (Next.js App Router)
│   │   ├── page.tsx                # Home / Landing page
│   │   ├── layout.tsx              # Root layout (PWA meta tags, providers)
│   │   ├── globals.css             # Global CSS styles
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── register/
│   │   │   └── page.tsx            # Register page
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Main dashboard (7 tabs)
│   │   │   └── layout.tsx          # Dashboard layout (auth guard)
│   │   ├── offline/
│   │   │   └── page.tsx            # Offline page (PWA)
│   │   └── api/auth/[...nextauth]/
│   │       └── route.ts            # NextAuth API route
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── AssetDashboard.tsx      # Live prices table with WebSocket
│   │   ├── CandlestickChart.tsx    # TradingView chart (OHLCV + volume)
│   │   ├── SignalPanel.tsx         # AI signal display
│   │   ├── MTFSignalPanel.tsx      # Multi-timeframe signal analysis
│   │   ├── PaperTradingPanel.tsx   # Open/close paper trades
│   │   ├── BacktestPanel.tsx       # Strategy backtesting
│   │   ├── RiskPanel.tsx           # Risk manager + position sizing
│   │   ├── ChatPanel.tsx           # AI market chat
│   │   ├── AlertsPanel.tsx         # Price alerts CRUD
│   │   ├── PortfolioPanel.tsx      # Equity curve + analytics
│   │   ├── TradeJournalPanel.tsx   # AI trade coaching journal
│   │   ├── SentimentPanel.tsx      # Sentiment heatmap
│   │   ├── CommunityPanel.tsx      # Community signals + voting
│   │   ├── PWAInstallPrompt.tsx    # "Install app" banner
│   │   └── Providers.tsx           # NextAuth SessionProvider wrapper
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── usePriceWebSocket.ts    # WebSocket live price updates hook
│   │
│   ├── lib/                        # API call functions
│   │   ├── api.ts                  # Base fetch function with timeout
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── market.ts               # Assets, prices, history API calls
│   │   ├── signals.ts              # Signal API calls
│   │   ├── trades.ts               # Trade API calls
│   │   ├── risk.ts                 # Risk API calls
│   │   ├── backtest.ts             # Backtest API calls
│   │   ├── chat.ts                 # Chat API calls
│   │   ├── alerts.ts               # Alerts API calls
│   │   ├── portfolio.ts            # Portfolio API calls
│   │   ├── journal.ts              # Journal API calls
│   │   ├── mtf.ts                  # Multi-timeframe API calls
│   │   └── community.ts            # Community API calls
│   │
│   └── types/                      # TypeScript type definitions
│       ├── market.ts               # Asset, Price, OHLCV, History types
│       ├── signal.ts               # Signal, Indicators types
│       ├── trade.ts                # Trade types
│       ├── backtest.ts             # Backtest types
│       ├── risk.ts                 # Risk types
│       ├── chat.ts                 # Chat message types
│       ├── alert.ts                # Price alert types
│       ├── portfolio.ts            # Portfolio stats types
│       ├── journal.ts              # Journal entry types
│       ├── mtf.ts                  # Multi-timeframe types
│       ├── community.ts            # Community signal types
│       └── next-auth.d.ts          # NextAuth session type extensions
│
├── .env.local                      # Your secrets (git ignored)
├── .env.local.example              # Example env file
├── .env.production                 # Production API URL (Render)
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXTAUTH_URL` | Your app URL (e.g. https://yourapp.vercel.app) |
| `NEXTAUTH_SECRET` | Random secret string (min 32 chars) |
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. https://yourapi.onrender.com) |

---

## 📱 Dashboard Tabs

| Tab | Components |
|---|---|
| **Overview** | Asset prices table + AI Signal + Sentiment + Chat |
| **Chart** | Candlestick chart + Multi-timeframe analysis |
| **Signals** | AI Signal + MTF + Backtest |
| **Trading** | Paper trading + Risk manager + Trade journal |
| **Portfolio** | Equity curve + Analytics stats |
| **Alerts** | Price alerts + Sentiment heatmap |
| **Community** | Community signals + Sentiment |

---

## 🎨 Design System

| Color | Usage |
|---|---|
| `emerald-500` (#10b981) | Primary — buttons, active states, BUY signals |
| `red-400/500` | SELL signals, losses, errors |
| `slate-950` | Page background |
| `slate-900` | Card background |
| `slate-800` | Borders |
| `slate-400` | Secondary text |

---

## ⚡ Key Libraries

| Library | Purpose |
|---|---|
| `next` 14 | React framework with App Router |
| `next-auth` | Authentication (JWT sessions) |
| `lightweight-charts` v5 | TradingView candlestick charts |
| `recharts` | Portfolio equity curve chart |
| `tailwindcss` | Utility-first CSS |
| `typescript` | Type safety |

---

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

Deploy to Vercel:
1. Push to GitHub
2. Import repo on vercel.com
3. Set Root Directory: `frontend`
4. Add environment variables
5. Deploy!
