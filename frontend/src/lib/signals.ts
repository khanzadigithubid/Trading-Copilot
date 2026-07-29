import { apiFetch } from "./api";
import type { SignalHistory, TradingSignal } from "@/types/signal";

export async function fetchSignal(symbol: string, refresh = false, token?: string): Promise<TradingSignal> {
  const query = refresh ? "?refresh=true" : "";
  return apiFetch<TradingSignal>(`/signals/${symbol}${query}`, {}, token);
}

export async function fetchSignalHistory(symbol: string, token?: string): Promise<SignalHistory> {
  return apiFetch<SignalHistory>(`/signals/${symbol}/history`, {}, token);
}
