import pandas as pd

from app.schemas.asset import OHLCVBar
from app.schemas.signal import TechnicalIndicators


def bars_to_dataframe(bars: list[OHLCVBar]) -> pd.DataFrame:
    rows = [
        {
            "timestamp": bar.timestamp,
            "open": bar.open,
            "high": bar.high,
            "low": bar.low,
            "close": bar.close,
            "volume": bar.volume or 0,
        }
        for bar in bars
    ]
    df = pd.DataFrame(rows).sort_values("timestamp").reset_index(drop=True)
    return df


def _rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()
    rs = avg_gain / avg_loss.replace(0, pd.NA)
    return 100 - (100 / (1 + rs))


def _ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def calculate_indicators(bars: list[OHLCVBar]) -> TechnicalIndicators | None:
    if len(bars) < 30:
        return None

    df = bars_to_dataframe(bars)
    close = df["close"]

    rsi_series = _rsi(close)
    ema12 = _ema(close, 12)
    ema26 = _ema(close, 26)
    macd_line = ema12 - ema26
    macd_signal = _ema(macd_line, 9)
    ma50 = close.rolling(50).mean()
    ma200 = close.rolling(200).mean()

    def last_valid(series: pd.Series) -> float | None:
        valid = series.dropna()
        if valid.empty:
            return None
        return round(float(valid.iloc[-1]), 6)

    return TechnicalIndicators(
        rsi=last_valid(rsi_series),
        macd=last_valid(macd_line),
        macd_signal=last_valid(macd_signal),
        ma50=last_valid(ma50),
        ma200=last_valid(ma200),
    )


def summarize_price_action(bars: list[OHLCVBar], count: int = 20) -> str:
    recent = bars[-count:] if len(bars) >= count else bars
    if not recent:
        return "No recent price data available."

    first = recent[0].close
    last = recent[-1].close
    change_pct = ((last - first) / first * 100) if first else 0
    direction = "up" if change_pct >= 0 else "down"
    high = max(bar.high for bar in recent)
    low = min(bar.low for bar in recent)
    return (
        f"Last {len(recent)} candles: {direction} {abs(change_pct):.2f}% "
        f"(from {first:.4f} to {last:.4f}), range {low:.4f}–{high:.4f}."
    )
