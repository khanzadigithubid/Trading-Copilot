import math

import pandas as pd

from app.schemas.asset import HistoryRange, OHLCVBar
from app.schemas.backtest import (
    BacktestRange,
    BacktestRunRequest,
    BacktestRunResponse,
    BacktestTradeRecord,
)
from app.services.indicators import _ema, _rsi, bars_to_dataframe
from app.services.market_data import aggregator
from app.services.market_data.catalog import get_asset


# ── Shared helpers ────────────────────────────────────────────────────────────

def _build_response(
    payload: BacktestRunRequest,
    records: list[BacktestTradeRecord],
    capital: float,
    max_drawdown: float,
) -> BacktestRunResponse:
    winning = sum(1 for t in records if t.pnl > 0)
    losing  = sum(1 for t in records if t.pnl <= 0)
    total   = len(records)
    win_rate     = (winning / total * 100) if total else 0
    total_return = ((capital - payload.initial_capital) / payload.initial_capital * 100) if payload.initial_capital else 0
    return BacktestRunResponse(
        symbol=payload.symbol.upper(),
        strategy=payload.strategy.value,
        range=payload.range.value,
        initial_capital=payload.initial_capital,
        final_capital=round(capital, 2),
        total_return_pct=round(total_return, 2),
        total_trades=total,
        winning_trades=winning,
        losing_trades=losing,
        win_rate=round(win_rate, 2),
        max_drawdown_pct=round(max_drawdown, 2),
        trades=records[-20:],
    )


def _close_position(
    position: dict,
    price: float,
    ts: str,
    capital: float,
    peak: float,
    max_drawdown: float,
    records: list[BacktestTradeRecord],
) -> tuple[float, float, float]:
    if position["type"] == "BUY":
        pnl = (price - position["entry_price"]) * position["size"]
    else:
        pnl = (position["entry_price"] - price) * position["size"]

    capital += pnl
    peak = max(peak, capital)
    dd = ((peak - capital) / peak * 100) if peak > 0 else 0
    max_drawdown = max(max_drawdown, dd)
    cost = position["entry_price"] * position["size"]
    records.append(BacktestTradeRecord(
        entry_time=position["entry_time"],
        exit_time=ts,
        type=position["type"],
        entry_price=round(position["entry_price"], 6),
        exit_price=round(price, 6),
        pnl=round(pnl, 2),
        pnl_percent=round((pnl / cost) * 100, 2) if cost else 0,
    ))
    return capital, peak, max_drawdown


# ── Engine ────────────────────────────────────────────────────────────────────

class BacktestEngine:
    async def run(self, payload: BacktestRunRequest) -> BacktestRunResponse:
        asset = get_asset(payload.symbol)
        if asset is None:
            raise ValueError(f"Unknown asset symbol: {payload.symbol}")

        history_range = self._map_range(payload.range)
        history = await aggregator.get_history(payload.symbol, history_range)
        bars = history.bars

        if len(bars) < 30:
            raise ValueError(
                f"Not enough historical data: got {len(bars)} bars, need ≥30. "
                "Try a longer range or a different asset."
            )

        strategy = payload.strategy.value
        if strategy == "rsi_macd":
            return self._run_rsi_macd(payload, bars)
        if strategy == "bollinger_bands":
            return self._run_bollinger(payload, bars)
        if strategy == "ema_crossover":
            return self._run_ema_crossover(payload, bars)
        if strategy == "supertrend":
            return self._run_supertrend(payload, bars)
        if strategy == "mean_reversion":
            return self._run_mean_reversion(payload, bars)
        raise ValueError(f"Unknown strategy: {strategy}")

    def _map_range(self, range: BacktestRange) -> HistoryRange:
        return {
            BacktestRange.w1: HistoryRange.w1,
            BacktestRange.m1: HistoryRange.m1,
            BacktestRange.y1: HistoryRange.y1,   # full 1-year daily/weekly bars
        }[range]

    # ── 1. RSI + MACD ─────────────────────────────────────────────────────────
    def _run_rsi_macd(self, payload: BacktestRunRequest, bars: list[OHLCVBar]) -> BacktestRunResponse:
        df = bars_to_dataframe(bars)
        close = df["close"]
        rsi = _rsi(close)
        macd_line   = _ema(close, 12) - _ema(close, 26)
        macd_signal = _ema(macd_line, 9)

        capital, peak, max_drawdown = payload.initial_capital, payload.initial_capital, 0.0
        position: dict | None = None
        records: list[BacktestTradeRecord] = []

        for i in range(30, len(df)):
            ts    = str(df.iloc[i]["timestamp"])
            price = float(df.iloc[i]["close"])
            r     = float(rsi.iloc[i])        if pd.notna(rsi.iloc[i])        else 50
            m     = float(macd_line.iloc[i])  if pd.notna(macd_line.iloc[i])  else 0
            s     = float(macd_signal.iloc[i]) if pd.notna(macd_signal.iloc[i]) else 0

            if position is None:
                if r < 35 and m > s:
                    position = {"type": "BUY",  "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
                elif r > 65 and m < s:
                    position = {"type": "SELL", "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
            else:
                close_it = (position["type"] == "BUY"  and (r > 65 or m < s)) or \
                           (position["type"] == "SELL" and (r < 35 or m > s))
                if close_it:
                    capital, peak, max_drawdown = _close_position(position, price, ts, capital, peak, max_drawdown, records)
                    position = None

        return _build_response(payload, records, capital, max_drawdown)

    # ── 2. Bollinger Bands ────────────────────────────────────────────────────
    def _run_bollinger(self, payload: BacktestRunRequest, bars: list[OHLCVBar]) -> BacktestRunResponse:
        df = bars_to_dataframe(bars)
        close = df["close"]
        period = 20
        ma  = close.rolling(period).mean()
        std = close.rolling(period).std()
        upper = ma + 2 * std
        lower = ma - 2 * std

        capital, peak, max_drawdown = payload.initial_capital, payload.initial_capital, 0.0
        position: dict | None = None
        records: list[BacktestTradeRecord] = []

        for i in range(period, len(df)):
            ts    = str(df.iloc[i]["timestamp"])
            price = float(df.iloc[i]["close"])
            lo    = float(lower.iloc[i]) if pd.notna(lower.iloc[i]) else price
            hi    = float(upper.iloc[i]) if pd.notna(upper.iloc[i]) else price
            mid   = float(ma.iloc[i])    if pd.notna(ma.iloc[i])    else price

            if position is None:
                if price < lo:
                    position = {"type": "BUY",  "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
                elif price > hi:
                    position = {"type": "SELL", "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
            else:
                close_it = (position["type"] == "BUY"  and price >= mid) or \
                           (position["type"] == "SELL" and price <= mid)
                if close_it:
                    capital, peak, max_drawdown = _close_position(position, price, ts, capital, peak, max_drawdown, records)
                    position = None

        return _build_response(payload, records, capital, max_drawdown)

    # ── 3. EMA Crossover (9/21) ───────────────────────────────────────────────
    def _run_ema_crossover(self, payload: BacktestRunRequest, bars: list[OHLCVBar]) -> BacktestRunResponse:
        df = bars_to_dataframe(bars)
        close = df["close"]
        ema_fast = _ema(close, 9)
        ema_slow = _ema(close, 21)

        capital, peak, max_drawdown = payload.initial_capital, payload.initial_capital, 0.0
        position: dict | None = None
        records: list[BacktestTradeRecord] = []

        for i in range(22, len(df)):
            ts    = str(df.iloc[i]["timestamp"])
            price = float(df.iloc[i]["close"])
            f_now  = float(ema_fast.iloc[i])   if pd.notna(ema_fast.iloc[i])   else price
            s_now  = float(ema_slow.iloc[i])   if pd.notna(ema_slow.iloc[i])   else price
            f_prev = float(ema_fast.iloc[i-1]) if pd.notna(ema_fast.iloc[i-1]) else price
            s_prev = float(ema_slow.iloc[i-1]) if pd.notna(ema_slow.iloc[i-1]) else price

            bullish_cross = f_prev <= s_prev and f_now > s_now
            bearish_cross = f_prev >= s_prev and f_now < s_now

            if position is None:
                if bullish_cross:
                    position = {"type": "BUY",  "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
                elif bearish_cross:
                    position = {"type": "SELL", "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
            else:
                close_it = (position["type"] == "BUY"  and bearish_cross) or \
                           (position["type"] == "SELL" and bullish_cross)
                if close_it:
                    capital, peak, max_drawdown = _close_position(position, price, ts, capital, peak, max_drawdown, records)
                    position = None

        return _build_response(payload, records, capital, max_drawdown)

    # ── 4. SuperTrend (ATR-based) ─────────────────────────────────────────────
    def _run_supertrend(self, payload: BacktestRunRequest, bars: list[OHLCVBar]) -> BacktestRunResponse:
        df = bars_to_dataframe(bars)
        atr_period, multiplier = 10, 3.0

        high  = df["high"]
        low   = df["low"]
        close = df["close"]

        tr = pd.concat([
            high - low,
            (high - close.shift()).abs(),
            (low  - close.shift()).abs(),
        ], axis=1).max(axis=1)
        atr = tr.rolling(atr_period).mean()

        upper_band = ((high + low) / 2) + multiplier * atr
        lower_band = ((high + low) / 2) - multiplier * atr

        supertrend = pd.Series(index=df.index, dtype=float)
        direction  = pd.Series(index=df.index, dtype=int)

        for i in range(len(df)):
            if i < atr_period:
                supertrend.iloc[i] = lower_band.iloc[i]
                direction.iloc[i] = 1
                continue
            prev_st  = supertrend.iloc[i - 1]
            prev_dir = direction.iloc[i - 1]
            c = float(close.iloc[i])
            lb = float(lower_band.iloc[i])
            ub = float(upper_band.iloc[i])

            lb = lb if lb > float(lower_band.iloc[i - 1]) or float(close.iloc[i - 1]) < float(lower_band.iloc[i - 1]) else float(lower_band.iloc[i - 1])
            ub = ub if ub < float(upper_band.iloc[i - 1]) or float(close.iloc[i - 1]) > float(upper_band.iloc[i - 1]) else float(upper_band.iloc[i - 1])

            if prev_dir == 1 and c < lb:
                direction.iloc[i] = -1
                supertrend.iloc[i] = ub
            elif prev_dir == -1 and c > ub:
                direction.iloc[i] = 1
                supertrend.iloc[i] = lb
            else:
                direction.iloc[i] = prev_dir
                supertrend.iloc[i] = lb if prev_dir == 1 else ub

        capital, peak, max_drawdown = payload.initial_capital, payload.initial_capital, 0.0
        position: dict | None = None
        records: list[BacktestTradeRecord] = []

        for i in range(atr_period + 1, len(df)):
            ts    = str(df.iloc[i]["timestamp"])
            price = float(df.iloc[i]["close"])
            dir_now  = int(direction.iloc[i])
            dir_prev = int(direction.iloc[i - 1])

            if position is None:
                if dir_prev == -1 and dir_now == 1:
                    position = {"type": "BUY",  "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
                elif dir_prev == 1 and dir_now == -1:
                    position = {"type": "SELL", "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
            else:
                close_it = (position["type"] == "BUY"  and dir_now == -1) or \
                           (position["type"] == "SELL" and dir_now == 1)
                if close_it:
                    capital, peak, max_drawdown = _close_position(position, price, ts, capital, peak, max_drawdown, records)
                    position = None

        return _build_response(payload, records, capital, max_drawdown)

    # ── 5. Mean Reversion (Z-score) ───────────────────────────────────────────
    def _run_mean_reversion(self, payload: BacktestRunRequest, bars: list[OHLCVBar]) -> BacktestRunResponse:
        df = bars_to_dataframe(bars)
        close = df["close"]
        period = 20
        ma  = close.rolling(period).mean()
        std = close.rolling(period).std()
        zscore = (close - ma) / std.replace(0, float("nan"))

        capital, peak, max_drawdown = payload.initial_capital, payload.initial_capital, 0.0
        position: dict | None = None
        records: list[BacktestTradeRecord] = []
        entry_z_threshold = 2.0

        for i in range(period, len(df)):
            ts    = str(df.iloc[i]["timestamp"])
            price = float(df.iloc[i]["close"])
            z     = float(zscore.iloc[i]) if pd.notna(zscore.iloc[i]) else 0

            if position is None:
                if z < -entry_z_threshold:
                    position = {"type": "BUY",  "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
                elif z > entry_z_threshold:
                    position = {"type": "SELL", "entry_price": price, "entry_time": ts, "size": (capital * 0.1) / price}
            else:
                close_it = (position["type"] == "BUY"  and z >= 0) or \
                           (position["type"] == "SELL" and z <= 0)
                if close_it:
                    capital, peak, max_drawdown = _close_position(position, price, ts, capital, peak, max_drawdown, records)
                    position = None

        return _build_response(payload, records, capital, max_drawdown)


backtest_engine = BacktestEngine()
