# 📡 Lib — API Functions

All functions that call the backend API.

## Base Function

### `api.ts`
```typescript
apiFetch<T>(path, options?, token?) → Promise<T>
```
- Adds `Authorization: Bearer {token}` header automatically
- AI endpoints get 90 second timeout (they can be slow)
- Other endpoints get 20 second timeout
- Throws readable error messages on failure

---

## API Modules

### `market.ts`
```typescript
fetchAssets(market?, token)              // GET /assets
fetchAssetPrice(symbol, token)           // GET /assets/{symbol}/price
fetchAssetHistory(symbol, range, token)  // GET /assets/{symbol}/history
getWebSocketUrl(path)                    // Converts http → ws URL
```

### `signals.ts`
```typescript
fetchSignal(symbol, refresh?, token)     // GET /signals/{symbol}
fetchSignalHistory(symbol, token)        // GET /signals/{symbol}/history
```

### `trades.ts`
```typescript
fetchMyTrades(token)                     // GET /trades/me
openPaperTrade(payload, token)           // POST /trades/paper/open
closePaperTrade(tradeId, token)          // POST /trades/paper/{id}/close
```

### `backtest.ts`
```typescript
runBacktest(payload, token)              // POST /backtest/run
```

### `risk.ts`
```typescript
fetchRiskSummary(token)                  // GET /risk/me
fetchPositionSize(symbol, entry, sl, token) // POST /risk/position-size
```

### `chat.ts`
```typescript
sendChatQuery(query, symbol?, token)     // POST /chat/query
```

### `alerts.ts`
```typescript
fetchAlerts(token)                       // GET /alerts
createAlert(symbol, condition, price, token) // POST /alerts
deleteAlert(id, token)                   // DELETE /alerts/{id}
checkAlerts(token)                       // POST /alerts/check
```

### `portfolio.ts`
```typescript
fetchPortfolioStats(token)               // GET /portfolio/stats
```

### `journal.ts`
```typescript
fetchJournal(token)                      // GET /journal
```

### `mtf.ts`
```typescript
fetchMTFSignal(symbol, token)            // GET /signals/{symbol}/mtf
```

### `community.ts`
```typescript
fetchCommunityFeed(symbol?, type?, token) // GET /community/feed
postCommunitySignal(payload, token)       // POST /community
voteSignal(id, token)                     // POST /community/{id}/vote
deleteCommunitySignal(id, token)          // DELETE /community/{id}
```

### `auth.ts`
NextAuth configuration — credentials provider that calls `/auth/login` and stores JWT token in session.
