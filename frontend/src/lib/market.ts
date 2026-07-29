import { apiFetch } from "./api";
import type { Asset, HistoryData, MarketType, PriceData } from "@/types/market";

export async function fetchAssets(market?: MarketType, token?: string): Promise<Asset[]> {
  const query = market ? `?market=${market}` : "";
  return apiFetch<Asset[]>(`/assets${query}`, {}, token);
}

export async function fetchAssetPrice(symbol: string, token?: string): Promise<PriceData> {
  return apiFetch<PriceData>(`/assets/${symbol}/price`, {}, token);
}

export async function fetchAssetHistory(
  symbol: string,
  range: "1d" | "1w" | "1m" | "1y" = "1d",
  token?: string
): Promise<HistoryData> {
  return apiFetch<HistoryData>(`/assets/${symbol}/history?range=${range}`, {}, token);
}

export function getWebSocketUrl(path: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const wsBase = apiUrl.replace(/^http/, "ws");
  return `${wsBase}${path}`;
}
