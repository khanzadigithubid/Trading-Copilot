"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URL } from "@/lib/api";
import type { PriceUpdate } from "@/types/market";

const POLL_INTERVAL = 6000; // 6 seconds — matches backend WebSocket broadcast interval

export function usePriceWebSocket(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [connected, setConnected] = useState(false);
  const symbolsKey = symbols.join(",");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    if (!symbols.length || !mountedRef.current) return;

    try {
      // Fetch prices for all symbols concurrently
      const results = await Promise.allSettled(
        symbols.map((sym) =>
          fetch(`${API_URL}/assets/${sym}/price`, {
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
  }, [symbolsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;

    if (!symbolsKey) {
      setConnected(false);
      return;
    }

    // Fetch immediately
    fetchPrices();

    // Then poll every 6 seconds
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
