export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// AI endpoints can take up to 90s with free models
const AI_PATHS = ["/chat/query", "/signals/", "/journal", "/backtest/run", "/briefing", "/news-impact", "/trade-planner"];

function getTimeout(path: string): number {
  return AI_PATHS.some((p) => path.includes(p)) ? 90_000 : 25_000;
}

/** Thrown when the server is unreachable or timed out — trigger wake-up UI */
export class ServerWakingUpError extends Error {
  constructor(message = "Server is waking up — please wait...") {
    super(message);
    this.name = "ServerWakingUpError";
  }
}

export function isWakingUp(err: unknown): boolean {
  return err instanceof ServerWakingUpError;
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
      throw new ServerWakingUpError(
        "Request timed out. The server is waking up — retrying automatically in 35 seconds."
      );
    }
    // Network error = server unreachable = likely sleeping
    throw new ServerWakingUpError(
      "Cannot reach the server. It may be waking up — retrying automatically."
    );
  } finally {
    clearTimeout(timer);
  }

  // Check content type — if HTML returned (server error page), handle gracefully
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`Server error (${response.status}). Please try again.`);
    }
    return {} as T;
  }

  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server. Please try again.");
  }

  if (!response.ok) {
    const detail = data.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? (detail as Array<{ msg?: string }>).map((item) => item.msg).filter(Boolean).join(", ")
          : (data.message as string) || "Request failed";
    throw new Error(message);
  }

  return data as T;
}
