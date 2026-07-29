export interface BacktestTradeRecord {
  entry_time: string;
  exit_time: string;
  type: string;
  entry_price: number;
  exit_price: number;
  pnl: number;
  pnl_percent: number;
}

export interface BacktestResult {
  symbol: string;
  strategy: string;
  range: string;
  initial_capital: number;
  final_capital: number;
  total_return_pct: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  max_drawdown_pct: number;
  trades: BacktestTradeRecord[];
}

export interface BacktestRunRequest {
  symbol: string;
  strategy?: string;
  range?: string;
  initial_capital?: number;
}
