"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  createSeriesMarkers,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type Time,
} from "lightweight-charts";

import { fetchAssetHistory } from "@/lib/market";
import type { OHLCVBar } from "@/types/market";
import type { TradingSignal } from "@/types/signal";

type Range = "1d" | "1w" | "1m" | "1y";

interface CandlestickChartProps {
  symbol: string;
  accessToken?: string;
  signal?: TradingSignal | null;
}

const RANGE_TABS: { id: Range; label: string }[] = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "1y", label: "1Y" },
];

export default function CandlestickChart({ symbol, accessToken, signal }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  const [range, setRange] = useState<Range>("1m");
  const [bars, setBars] = useState<OHLCVBar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  // Create chart once on mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#020617" },
        textColor: "#94a3b8",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#334155" },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 320,
    });

    // v5 API: addSeries(SeriesType, options)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#334155",
      priceFormat: { type: "volume" as const },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    markersRef.current = createSeriesMarkers(candleSeries);

    const observer = new ResizeObserver((entries) => {
      if (entries[0] && chartRef.current) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width });
      }
    });
    observer.observe(chartContainerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Load data when symbol or range changes
  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    const fetchRange = range === "1y" ? "1m" : range;

    fetchAssetHistory(symbol, fetchRange, accessToken)
      .then((data) => {
        setBars(data.bars);
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        const candleData = data.bars.map((b) => ({
          time: Math.floor(new Date(b.timestamp).getTime() / 1000) as Time,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }));

        const volumeData = data.bars.map((b) => ({
          time: Math.floor(new Date(b.timestamp).getTime() / 1000) as Time,
          value: b.volume ?? 0,
          color: b.close >= b.open ? "#10b98133" : "#ef444433",
        }));

        candleSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
        chartRef.current?.timeScale().fitContent();

        if (candleData.length >= 2) {
          const last = candleData[candleData.length - 1];
          const first = candleData[0];
          setCurrentPrice(last.close);
          setPriceChange(((last.close - first.open) / first.open) * 100);
        }

        // Signal marker on last candle — v5 uses createSeriesMarkers plugin
        if (markersRef.current) {
          if (signal && candleData.length > 0) {
            const lastBar = candleData[candleData.length - 1];
            const markerColor =
              signal.signal === "BUY" ? "#10b981" : signal.signal === "SELL" ? "#ef4444" : "#94a3b8";
            markersRef.current.setMarkers([
              {
                time: lastBar.time,
                position: signal.signal === "BUY" ? "belowBar" : "aboveBar",
                color: markerColor,
                shape: signal.signal === "BUY" ? "arrowUp" : signal.signal === "SELL" ? "arrowDown" : "circle",
                text: signal.signal,
              },
            ]);
          } else {
            markersRef.current.setMarkers([]);
          }
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load chart data"))
      .finally(() => setLoading(false));
  }, [symbol, range, accessToken, signal]);

  const isUp = (priceChange ?? 0) >= 0;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{symbol} — Price Chart</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Candlestick · Volume{signal ? ` · AI Signal: ${signal.signal}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {currentPrice != null && (
            <span className="font-mono text-xl font-semibold text-slate-100">
              {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </span>
          )}
          {priceChange != null && (
            <span className={`text-sm font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      {/* Range tabs */}
      <div className="mt-4 flex gap-1">
        {RANGE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRange(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              range === tab.id
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="relative mt-4">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-950/70">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        )}
        {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
        <div ref={chartContainerRef} className="w-full" />
      </div>

      {/* OHLCV stats bar */}
      {bars.length > 0 && (() => {
        const last = bars[bars.length - 1];
        return (
          <div className="mt-4 grid grid-cols-4 gap-3 border-t border-slate-800 pt-4 text-center text-xs">
            {([
              ["Open", last.open],
              ["High", last.high],
              ["Low", last.low],
              ["Volume", last.volume != null ? last.volume : null],
            ] as [string, number | null][]).map(([label, value]) => (
              <div key={label}>
                <p className="text-slate-500">{label}</p>
                <p className="mt-0.5 font-mono text-slate-200">
                  {value != null
                    ? label === "Volume"
                      ? `${(value / 1000).toFixed(1)}K`
                      : value.toLocaleString(undefined, { maximumFractionDigits: 6 })
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        );
      })()}
    </section>
  );
}
