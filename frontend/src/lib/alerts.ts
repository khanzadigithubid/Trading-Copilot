import { apiFetch } from "./api";
import type { AlertCondition, AlertListResponse, PriceAlert } from "@/types/alert";

export async function fetchAlerts(token?: string): Promise<AlertListResponse> {
  return apiFetch<AlertListResponse>("/alerts", {}, token);
}

export async function createAlert(
  symbol: string,
  condition: AlertCondition,
  targetPrice: number,
  token?: string
): Promise<PriceAlert> {
  return apiFetch<PriceAlert>(
    "/alerts",
    {
      method: "POST",
      body: JSON.stringify({ symbol, condition, target_price: targetPrice }),
    },
    token
  );
}

export async function deleteAlert(alertId: string, token?: string): Promise<void> {
  await apiFetch<void>(`/alerts/${alertId}`, { method: "DELETE" }, token);
}

export async function checkAlerts(token?: string): Promise<AlertListResponse> {
  return apiFetch<AlertListResponse>("/alerts/check", { method: "POST" }, token);
}
