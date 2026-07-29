export interface EquityPoint {
  date: string;
  equity: number;
  pnl: number;
}

export interface StreakInfo {
  current_win_streak: number;
  current_loss_streak: number;
  best_win_streak: number;
  worst_loss_streak: number;
}

export interface PortfolioStats {
  user_id: string;
  initial_capital: number;
  current_equity: number;
  total_pnl: number;
  total_pnl_pct: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  best_trade: number;
  worst_trade: number;
  streaks: StreakInfo;
  equity_curve: EquityPoint[];
}
