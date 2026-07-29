import type { RiskLevel, SignalAction, TechnicalIndicators } from "./signal";

export interface TimeframeSignal {
  timeframe: string;
  label: string;
  signal: SignalAction;
  confidence: number;
  reasoning: string;
  indicators?: TechnicalIndicators | null;
}

export interface MTFSignalResponse {
  symbol: string;
  combined_signal: SignalAction;
  combined_confidence: number;
  combined_reasoning: string;
  risk_level: RiskLevel;
  agreement: boolean;
  timeframes: TimeframeSignal[];
  source: string;
}
