import { apiFetch } from "./api";
import type { PositionSizeResult, UserRiskSummary } from "@/types/risk";

export async function fetchRiskSummary(token?: string): Promise<UserRiskSummary> {
  return apiFetch<UserRiskSummary>("/risk/me", {}, token);
}

export async function fetchPositionSize(
  symbol: string,
  entry: number,
  stopLoss: number,
  token?: string
): Promise<PositionSizeResult> {
  const params = new URLSearchParams({
    symbol,
    entry: String(entry),
    stop_loss: String(stopLoss),
  });
  return apiFetch<PositionSizeResult>(`/risk/position-size?${params}`, {}, token);
}
