export type SignalType = "BUY" | "SELL" | "HOLD";

export interface CommunitySignal {
  id: string;
  symbol: string;
  signal: SignalType;
  confidence: number;
  reasoning: string;
  timeframe: string;
  upvotes: number;
  author_email: string;
  created_at: string;
  voted_by_me: boolean;
}

export interface CommunityFeedResponse {
  signals: CommunitySignal[];
  total: number;
}

export interface CommunitySignalCreate {
  symbol: string;
  signal: SignalType;
  confidence: number;
  reasoning: string;
  timeframe: string;
}
