"use client";

import { useEffect, useRef, useState } from "react";

import { getWebSocketUrl } from "@/lib/market";
import type { PriceUpdate } from "@/types/market";

export function usePriceWebSocket(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [connected, setConnected] = useState(false);
  const symbolsKey = symbols.join(",");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbolsKey) {
      setConnected(false);
      return;
    }

    // Re-subscribe on existing open socket instead of tearing it down
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", symbols }));
      return;
    }

    const ws = new WebSocket(getWebSocketUrl("/ws/prices"));
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ action: "subscribe", symbols }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        if (message.type !== "prices" || !Array.isArray(message.data)) {
          return;
        }
        setPrices((prev) => {
          const next = { ...prev };
          for (const update of message.data as PriceUpdate[]) {
            next[update.symbol] = update;
          }
          return next;
        });
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };
    ws.onerror = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey]);

  return { prices, connected };
}
