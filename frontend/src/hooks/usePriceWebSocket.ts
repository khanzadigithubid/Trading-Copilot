"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URL } from "@/lib/api";
import type { PriceUpdate } from "@/types/market";

const POLL_INTERVAL = 6000; // 6 seconds

/**
 * Polls live prices for the given symbols every 6 seconds.
 * Accepts an optional `token` so that if the price endpoint ever becomes
 * protected, or if we switch to the authenticated /ws/prices WebSocket,
 * the token is already threaded through.
 */
export function usePriceWebSocket(symbols: string[], token?: string) {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [connected, setConnected] = useState(false);
  const symbolsKey = symbols.join(",");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    if (!symbols.length || !mountedRef.current) return;

    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    try {
      const results = await Promise.allSettled(
        symbols.map((sym) =>
          fetch(`${API_URL}/assets/${sym}/price`, {
            headers,
            signal: AbortSignal.timeout(5000),
          }).then((r) => (r.ok ? r.json() : null))
        )
      );

      if (!mountedRef.current) return;

      const next: Record<string, PriceUpdate> = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value) {
          const data = result.value;
          next[symbols[i]] = {
            symbol: data.symbol,
            market_type: data.market_type,
            price: data.price,
            change: data.change,
            change_percent: data.change_percent,
            timestamp: data.timestamp,
          } as PriceUpdate;
        }
      });

      if (Object.keys(next).length > 0) {
        setPrices((prev) => ({ ...prev, ...next }));
        setConnected(true);
      }
    } catch {
      if (mountedRef.current) setConnected(false);
    }
  }, [symbolsKey, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;

    if (!symbolsKey) {
      setConnected(false);
      return;
    }

    fetchPrices();
    timerRef.current = setInterval(fetchPrices, POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [symbolsKey, fetchPrices]);

  return { prices, connected };
}
