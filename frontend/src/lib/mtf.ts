import { apiFetch } from "./api";
import type { MTFSignalResponse } from "@/types/mtf";

export async function fetchMTFSignal(symbol: string, token?: string): Promise<MTFSignalResponse> {
  return apiFetch<MTFSignalResponse>(`/signals/${symbol}/mtf`, {}, token);
}
