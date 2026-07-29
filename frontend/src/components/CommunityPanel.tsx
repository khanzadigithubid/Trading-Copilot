"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteCommunitySignal,
  fetchCommunityFeed,
  postCommunitySignal,
  voteSignal,
} from "@/lib/community";
import type { CommunitySignal, SignalType } from "@/types/community";

interface CommunityPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
  userEmail?: string;
}

function signalBadge(signal: SignalType) {
  switch (signal) {
    case "BUY":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "SELL":
      return "bg-red-500/15 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SignalCard({
  sig,
  userEmail,
  onVote,
  onDelete,
}: {
  sig: CommunitySignal;
  userEmail?: string;
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isOwn = userEmail
    ? sig.author_email.startsWith(userEmail.slice(0, 2))
    : false;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100">{sig.symbol}</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${signalBadge(sig.signal)}`}>
            {sig.signal}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            {sig.timeframe.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{sig.author_email}</span>
          <span>{timeAgo(sig.created_at)}</span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 flex-1 rounded-full bg-slate-800">
          <div
            className="h-1 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${sig.confidence}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{sig.confidence.toFixed(0)}%</span>
      </div>

      {/* Reasoning */}
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{sig.reasoning}</p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onVote(sig.id)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            sig.voted_by_me
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
              : "border-slate-700 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400"
          }`}
        >
          <span>{sig.voted_by_me ? "▲" : "△"}</span>
          <span>{sig.upvotes}</span>
          <span>{sig.upvotes === 1 ? "vote" : "votes"}</span>
        </button>
        {isOwn && (
          <button
            onClick={() => onDelete(sig.id)}
            className="text-xs text-slate-600 hover:text-red-400 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function CommunityPanel({
  accessToken,
  selectedSymbol,
  userEmail,
}: CommunityPanelProps) {
  const [signals, setSignals] = useState<CommunitySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSignal, setFilterSignal] = useState<SignalType | "all">("all");

  // Post form
  const [showForm, setShowForm] = useState(false);
  const [formSymbol, setFormSymbol] = useState("");
  const [formSignal, setFormSignal] = useState<SignalType>("BUY");
  const [formConfidence, setFormConfidence] = useState("70");
  const [formReasoning, setFormReasoning] = useState("");
  const [formTimeframe, setFormTimeframe] = useState("1d");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (selectedSymbol) setFormSymbol(selectedSymbol);
  }, [selectedSymbol]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCommunityFeed(
        null,
        filterSignal === "all" ? null : filterSignal,
        accessToken
      );
      setSignals(data.signals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [accessToken, filterSignal]);

  useEffect(() => { load(); }, [load]);

  async function handleVote(id: string) {
    if (!accessToken) return;
    try {
      const updated = await voteSignal(id, accessToken);
      setSignals((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!accessToken) return;
    try {
      await deleteCommunitySignal(id, accessToken);
      setSignals((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  }

  async function handlePost() {
    if (!formSymbol || !formReasoning.trim() || !accessToken) return;
    setPosting(true);
    setError(null);
    try {
      const created = await postCommunitySignal(
        {
          symbol: formSymbol.toUpperCase(),
          signal: formSignal,
          confidence: parseFloat(formConfidence),
          reasoning: formReasoning.trim(),
          timeframe: formTimeframe,
        },
        accessToken
      );
      setSignals((prev) => [created, ...prev]);
      setFormReasoning("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  }

  const buyCount = signals.filter((s) => s.signal === "BUY").length;
  const sellCount = signals.filter((s) => s.signal === "SELL").length;
  const holdCount = signals.filter((s) => s.signal === "HOLD").length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Community Signals</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Share and vote on trading ideas with other members.
          </p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
        >
          {showForm ? "Cancel" : "+ Share Signal"}
        </button>
      </div>

      {/* Sentiment summary bar */}
      {signals.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-xs">
          <span className="text-slate-500 mr-1">Community mood:</span>
          <span className="text-emerald-400 font-semibold">{buyCount} BUY</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-semibold">{holdCount} HOLD</span>
          <span className="text-slate-600">·</span>
          <span className="text-red-400 font-semibold">{sellCount} SELL</span>
          <div className="ml-auto flex h-2 w-24 overflow-hidden rounded-full bg-slate-800">
            {signals.length > 0 && (
              <>
                <div className="bg-emerald-500 transition-all" style={{ width: `${(buyCount / signals.length) * 100}%` }} />
                <div className="bg-slate-500 transition-all" style={{ width: `${(holdCount / signals.length) * 100}%` }} />
                <div className="bg-red-500 transition-all" style={{ width: `${(sellCount / signals.length) * 100}%` }} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Post form */}
      {showForm && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-200">Share your analysis</p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Symbol"
              value={formSymbol}
              onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
              className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm uppercase outline-none focus:border-emerald-500"
            />
            <select
              value={formSignal}
              onChange={(e) => setFormSignal(e.target.value as SignalType)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="HOLD">HOLD</option>
            </select>
            <select
              value={formTimeframe}
              onChange={(e) => setFormTimeframe(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="1d">1D</option>
              <option value="1w">1W</option>
              <option value="1m">1M</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={formConfidence}
                onChange={(e) => setFormConfidence(e.target.value)}
                className="w-24 accent-emerald-500"
              />
              <span className="text-xs text-slate-400 w-12">{formConfidence}% conf.</span>
            </div>
          </div>
          <textarea
            placeholder="Share your reasoning (min 10 characters)..."
            value={formReasoning}
            onChange={(e) => setFormReasoning(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none"
          />
          <button
            onClick={handlePost}
            disabled={posting || !formSymbol || formReasoning.trim().length < 10}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
          >
            {posting ? "Posting..." : "Post signal"}
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["all", "BUY", "SELL", "HOLD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterSignal(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filterSignal === f
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {/* Feed */}
      <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-800" />
          ))
        ) : signals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-slate-500 text-sm">No signals yet.</p>
            <p className="text-slate-600 text-xs mt-1">Be the first to share your analysis!</p>
          </div>
        ) : (
          signals.map((sig) => (
            <SignalCard
              key={sig.id}
              sig={sig}
              userEmail={userEmail}
              onVote={handleVote}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
