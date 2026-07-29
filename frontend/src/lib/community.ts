import { apiFetch } from "./api";
import type {
  CommunityFeedResponse,
  CommunitySignal,
  CommunitySignalCreate,
} from "@/types/community";

export async function fetchCommunityFeed(
  symbol?: string | null,
  signalType?: string | null,
  token?: string
): Promise<CommunityFeedResponse> {
  const params = new URLSearchParams();
  if (symbol) params.set("symbol", symbol);
  if (signalType) params.set("signal_type", signalType);
  const qs = params.toString() ? `?${params}` : "";
  return apiFetch<CommunityFeedResponse>(`/community/feed${qs}`, {}, token);
}

export async function postCommunitySignal(
  payload: CommunitySignalCreate,
  token?: string
): Promise<CommunitySignal> {
  return apiFetch<CommunitySignal>(
    "/community",
    { method: "POST", body: JSON.stringify(payload) },
    token
  );
}

export async function voteSignal(
  signalId: string,
  token?: string
): Promise<CommunitySignal> {
  return apiFetch<CommunitySignal>(
    `/community/${signalId}/vote`,
    { method: "POST" },
    token
  );
}

export async function deleteCommunitySignal(
  signalId: string,
  token?: string
): Promise<void> {
  await apiFetch<void>(`/community/${signalId}`, { method: "DELETE" }, token);
}
