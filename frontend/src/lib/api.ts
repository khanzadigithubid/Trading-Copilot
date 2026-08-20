export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SERVER_UNREACHABLE =
  `Cannot reach the server. The backend may be waking up — please wait 30 seconds and try again.`;

// AI endpoints can take up to 90s with free models
const AI_PATHS = ["/chat/query", "/signals/", "/journal", "/backtest/run", "/briefing", "/news-impact", "/trade-planner"];

function getTimeout(path: string): number {
  return AI_PATHS.some((p) => path.includes(p)) ? 90_000 : 25_000;
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
      throw new Error("Request timed out. The server is waking up — please try again in 30 seconds.");
    }
    throw new Error(SERVER_UNREACHABLE);
  } finally {
    clearTimeout(timer);
  }

  // Check content type — if HTML returned (server error page), handle gracefully
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`Server error (${response.status}). Please try again.`);
    }
    // Unexpected non-JSON success
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
