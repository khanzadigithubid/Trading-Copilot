# 🧩 Components

All React UI components for the dashboard.

## Component Map

### Data Display
| Component | Description |
|---|---|
| `AssetDashboard.tsx` | Live price table with market filter tabs. Connects to WebSocket for real-time updates. Click a row to select asset. |
| `CandlestickChart.tsx` | TradingView candlestick chart with volume histogram, signal markers, OHLCV stats bar, and range tabs (1D/1W/1M/1Y). |
| `SentimentPanel.tsx` | Heatmap grid showing sentiment score (-1 to +1) for all 27 assets. Color coded from red (bearish) to green (bullish). |

### AI & Signals
| Component | Description |
|---|---|
| `SignalPanel.tsx` | Shows AI signal (BUY/SELL/HOLD), confidence %, reasoning, and technical indicators for selected asset. |
| `MTFSignalPanel.tsx` | Multi-timeframe analysis — runs 1D + 1W + 1M signals and combines them with weighted voting. |
| `ChatPanel.tsx` | Chat interface for asking market questions in plain language. Shows typing animation while AI responds. |

### Trading
| Component | Description |
|---|---|
| `PaperTradingPanel.tsx` | Open/close virtual trades. Shows open positions and closed trade history with P&L. |
| `BacktestPanel.tsx` | Select asset + strategy + range + capital → run historical backtest → see results table. |
| `RiskPanel.tsx` | Position size calculator. Enter entry price + stop loss → get suggested position size. |

### Analytics
| Component | Description |
|---|---|
| `PortfolioPanel.tsx` | Equity curve chart (recharts AreaChart) + 8 stats cards (win rate, Sharpe, drawdown, streaks). |
| `TradeJournalPanel.tsx` | AI-generated coaching cards for each closed trade. Expandable with analysis + lesson. |

### Alerts & Community
| Component | Description |
|---|---|
| `AlertsPanel.tsx` | Create price alerts (above/below target). Check button triggers live price comparison. |
| `CommunityPanel.tsx` | Feed of shared trade signals. Post your own analysis. Vote on others. BUY/SELL/HOLD filter tabs. |

### App Shell
| Component | Description |
|---|---|
| `Providers.tsx` | Wraps app with NextAuth SessionProvider |
| `PWAInstallPrompt.tsx` | Shows "Install app" banner when browser fires beforeinstallprompt event |

---

## Shared Props Pattern

Most components receive:
```typescript
accessToken?: string      // JWT token for authenticated API calls
selectedSymbol?: string   // Currently selected asset (e.g. "BTCUSDT")
```

The `selectedSymbol` flows down from `dashboard/page.tsx` which manages it in state.
