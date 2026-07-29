export interface RiskAlert {
  type: string;
  severity: string;
  message: string;
}

export interface UserRiskSummary {
  user_id: string;
  capital: number;
  risk_tolerance_pct: number;
  trades_today: number;
  max_daily_trades: number;
  overtrading: boolean;
  open_trades: number;
  closed_trades: number;
  total_pnl: number;
  drawdown_pct: number;
  peak_equity: number;
  current_equity: number;
  alerts: RiskAlert[];
}

export interface PositionSizeResult {
  symbol: string;
  entry: number;
  stop_loss: number;
  capital: number;
  risk_tolerance_pct: number;
  risk_amount: number;
  risk_per_unit: number;
  suggested_size: number;
  max_loss: number;
  note: string;
}
