export type SignalAction = "BUY" | "SELL" | "HOLD";
export type RiskLevel = "low" | "medium" | "high";

export interface TechnicalIndicators {
  rsi?: number | null;
  macd?: number | null;
  macd_signal?: number | null;
  ma50?: number | null;
  ma200?: number | null;
}

export interface TradingSignal {
  id?: string | null;
  symbol: string;
  signal: SignalAction;
  confidence: number;
  reasoning: string;
  risk_level: RiskLevel;
  indicators?: TechnicalIndicators | null;
  created_at?: string | null;
  source?: string;
}

export interface SignalHistory {
  symbol: string;
  signals: TradingSignal[];
}
