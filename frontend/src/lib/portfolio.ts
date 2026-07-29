import { apiFetch } from "./api";
import type { PortfolioStats } from "@/types/portfolio";

export async function fetchPortfolioStats(token?: string): Promise<PortfolioStats> {
  return apiFetch<PortfolioStats>("/portfolio/stats", {}, token);
}
