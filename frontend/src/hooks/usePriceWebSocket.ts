"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URL } from "@/lib/api";
import type { PriceUpdate } from "@/types/market";

const POLL_INTERVAL = 10000;  // 10 seconds
const BATCH_SIZE    = 10;     // max concurrent requests at once
const BATCH_DELAY   = 200;    // ms between batches

/**
 * Polls live prices in small batches to avoid overwhelming the server
 * and triggering browser connection limits / CORS preflight failures.
 */
export function usePriceWebSocket(symbols: string[], token?: string) {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [connected, setConnected] = useState(false);
  const symbolsKey = symbols.join(",");
  const timerRef   = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    if (!symbols.length || !mountedRef.current) return;

    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const next: Record<string, PriceUpdate> = {};

    // Split into batches to avoid 100+ concurrent requests
    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      if (!mountedRef.current) break;

      const batch = symbols.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((sym) =>
          fetch(`${API_URL}/assets/${sym}/price`, {
            headers,
            signal: AbortSignal.timeout(8000),
          }).then((r) => (r.ok ? r.json() : null))
        )
      );

      results.forEach((result, j) => {
        if (result.status === "fulfilled" && result.value) {
          const data = result.value;
          next[batch[j]] = {
            symbol:         data.symbol,
            market_type:    data.market_type,
            price:          data.price,
            change:         data.change,
            change_percent: data.change_percent,
            timestamp:      data.timestamp,
          } as PriceUpdate;
        }
      });

      // Small delay between batches — avoid overwhelming server
      if (i + BATCH_SIZE < symbols.length) {
        await new Promise((res) => setTimeout(res, BATCH_DELAY));
      }
    }

    if (!mountedRef.current) return;

    if (Object.keys(next).length > 0) {
      setPrices((prev) => ({ ...prev, ...next }));
      setConnected(true);
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
