export type AlertCondition = "above" | "below";

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  target_price: number;
  is_triggered: boolean;
  is_active: boolean;
  triggered_at?: string | null;
  created_at: string;
}

export interface AlertListResponse {
  alerts: PriceAlert[];
  total: number;
}
