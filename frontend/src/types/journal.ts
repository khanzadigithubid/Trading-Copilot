export type TradeRating = "excellent" | "good" | "poor";

export interface JournalEntry {
  trade_id: string;
  symbol: string;
  type: string;
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
  pnl_percent: number;
  duration_minutes: number;
  ai_analysis: string;
  lesson: string;
  rating: TradeRating;
  created_at: string;
}

export interface JournalResponse {
  entries: JournalEntry[];
  total: number;
}
