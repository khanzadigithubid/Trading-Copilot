from pydantic import BaseModel

from app.schemas.signal import RiskLevel, SignalAction, TechnicalIndicators


class TimeframeSignal(BaseModel):
    timeframe: str          # "1d" | "1w" | "1m"
    label: str              # "Short-term" | "Mid-term" | "Long-term"
    signal: SignalAction
    confidence: float
    reasoning: str
    indicators: TechnicalIndicators | None = None


class MTFSignalResponse(BaseModel):
    symbol: str
    combined_signal: SignalAction
    combined_confidence: float
    combined_reasoning: str
    risk_level: RiskLevel
    agreement: bool         # True if all 3 timeframes agree
    timeframes: list[TimeframeSignal]
    source: str = "rules"
