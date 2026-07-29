import { apiFetch } from "./api";
import type { BacktestResult, BacktestRunRequest } from "@/types/backtest";

export async function runBacktest(payload: BacktestRunRequest, token?: string): Promise<BacktestResult> {
  return apiFetch<BacktestResult>(
    "/backtest/run",
    {
      method: "POST",
      body: JSON.stringify({
        symbol: payload.symbol,
        strategy: payload.strategy || "rsi_macd",
        range: payload.range || "1m",
        initial_capital: payload.initial_capital || 10000,
      }),
    },
    token
  );
}
