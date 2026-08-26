export type TradeType = "BUY" | "SELL";
export type TradeStatus = "open" | "closed";

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  market_type: string;
  type: TradeType;
  entry_price: number;
  exit_price?: number | null;
  stop_loss?: number | null;
  take_profit?: number | null;
  size: number;
  status: TradeStatus;
  is_paper: boolean;
  pnl?: number | null;
  pnl_percent?: number | null;
  created_at: string;
  closed_at?: string | null;
}

export interface TradeList {
  user_id: string;
  trades: Trade[];
  open_count: number;
  closed_count: number;
  total_realized_pnl: number;
}

export interface PaperTradeOpenRequest {
  symbol: string;
  type: TradeType;
  size: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
}
