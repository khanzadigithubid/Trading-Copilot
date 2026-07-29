export type MarketType = "forex" | "crypto" | "stock";

export interface Asset {
  id?: string;
  symbol: string;
  market_type: MarketType;
  name?: string | null;
}

export interface PriceData {
  symbol: string;
  market_type: MarketType;
  price: number;
  change?: number | null;
  change_percent?: number | null;
  currency?: string;
  timestamp: string;
  source?: string;
}

export interface OHLCVBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number | null;
}

export interface HistoryData {
  symbol: string;
  market_type: MarketType;
  range: "1d" | "1w" | "1m" | "1y";
  bars: OHLCVBar[];
  source?: string;
}

export interface PriceUpdate {
  symbol: string;
  market_type: MarketType;
  price: number;
  change?: number | null;
  change_percent?: number | null;
  timestamp: string;
}
