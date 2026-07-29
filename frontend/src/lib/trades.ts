import { apiFetch } from "./api";
import type { PaperTradeOpenRequest, Trade, TradeList } from "@/types/trade";

export async function fetchMyTrades(token?: string): Promise<TradeList> {
  return apiFetch<TradeList>("/trades/me", {}, token);
}

export async function openPaperTrade(payload: PaperTradeOpenRequest, token?: string): Promise<Trade> {
  return apiFetch<Trade>(
    "/trades/paper",
    { method: "POST", body: JSON.stringify(payload) },
    token
  );
}

export async function closePaperTrade(tradeId: string, token?: string, exitPrice?: number): Promise<Trade> {
  return apiFetch<Trade>(
    `/trades/${tradeId}/close`,
    {
      method: "POST",
      body: JSON.stringify(exitPrice ? { exit_price: exitPrice } : {}),
    },
    token
  );
}
