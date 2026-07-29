import { apiFetch } from "./api";
import type { ChatQueryResponse } from "@/types/chat";

export async function sendChatQuery(
  query: string,
  symbol?: string | null,
  token?: string
): Promise<ChatQueryResponse> {
  return apiFetch<ChatQueryResponse>(
    "/chat/query",
    {
      method: "POST",
      body: JSON.stringify({ query, symbol: symbol || undefined }),
    },
    token
  );
}
