export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

export interface ChatQueryResponse {
  query: string;
  response: string;
  symbols_used: string[];
  source: string;
}
