export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SERVER_UNREACHABLE =
  "Cannot reach the server. Make sure the backend is running on http://localhost:8000";

// AI endpoints (chat, signals, journal) can take up to 90s with free models
const AI_PATHS = ["/chat/query", "/signals/", "/journal", "/backtest/run"];

function getTimeout(path: string): number {
  return AI_PATHS.some((p) => path.includes(p)) ? 90_000 : 20_000;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), getTimeout(path));

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. The AI is thinking — please try again.");
    }
    throw new Error(SERVER_UNREACHABLE);
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(", ")
          : data.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
}
