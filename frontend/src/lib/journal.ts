import { apiFetch } from "./api";
import type { JournalResponse } from "@/types/journal";

export async function fetchJournal(token?: string): Promise<JournalResponse> {
  return apiFetch<JournalResponse>("/journal", {}, token);
}
