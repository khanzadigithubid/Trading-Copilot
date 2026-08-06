"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import AlertsPanel from "@/components/AlertsPanel";
import AssetDashboard from "@/components/AssetDashboard";
import BacktestPanel from "@/components/BacktestPanel";
import BriefingPanel from "@/components/BriefingPanel";
import CandlestickChart from "@/components/CandlestickChart";
import ChatPanel from "@/components/ChatPanel";
import CommunityPanel from "@/components/CommunityPanel";
import MTFSignalPanel from "@/components/MTFSignalPanel";
import NewsImpactPanel from "@/components/NewsImpactPanel";
import PaperTradingPanel from "@/components/PaperTradingPanel";
import PortfolioPanel from "@/components/PortfolioPanel";
import RiskPanel from "@/components/RiskPanel";
import SentimentPanel from "@/components/SentimentPanel";
import SignalPanel from "@/components/SignalPanel";
import TradePlannerPanel from "@/components/TradePlannerPanel";
import TradeJournalPanel from "@/components/TradeJournalPanel";

type DashTab = "overview" | "chart" | "signals" | "trading" | "portfolio" | "alerts" | "community" | "ai";

const TABS: { id: DashTab; label: string; icon: string }[] = [
  { id: "overview",   label: "Overview",   icon: "⬡" },
  { id: "chart",      label: "Chart",      icon: "📈" },
  { id: "signals",    label: "Signals",    icon: "🤖" },
  { id: "trading",    label: "Trading",    icon: "💼" },
  { id: "portfolio",  label: "Portfolio",  icon: "📊" },
  { id: "alerts",     label: "Alerts",     icon: "🔔" },
  { id: "community",  label: "Community",  icon: "👥" },
  { id: "ai",         label: "AI Tools",   icon: "✨" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashTab>("overview");

  // Auto sign out if token refresh failed
  useEffect(() => {
    const err = (session as { error?: string })?.error;
    if (err === "TokenExpired" || err === "RefreshFailed") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  // Read ?tab= from URL on mount (used by home page feature cards)
  useEffect(() => {
    const tab = searchParams.get("tab") as DashTab | null;
    const validTabs: DashTab[] = ["overview", "chart", "signals", "trading", "portfolio", "alerts", "community"];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Please sign in to continue.</p>
        <Link href="/login" className="text-emerald-400 hover:underline">Go to login</Link>
      </div>
    );
  }

  const token = session.user.accessToken;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── Top header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          {/* Left — Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm">
              AI
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-400 leading-none">Trading Copilot</p>
              <p className="text-base font-semibold leading-tight">Dashboard</p>
            </div>
          </div>

          {/* Center — selected asset pill */}
          <div className="flex flex-1 justify-center">
            {selectedSymbol && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-emerald-400 font-medium">
                {selectedSymbol}
              </span>
            )}
          </div>

          {/* Right — User avatar + name + signout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm select-none">
                {(session.user.email || "U")[0].toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-100">
                {session.user.email?.split("@")[0]}
              </span>
            </div>

            {/* Divider */}
            <div className="h-4 sm:h-5 w-px bg-slate-700" />

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-700 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Stats bar ── */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-2 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {[
              {
                label: "Capital",
                value: `$${session.user.capital.toLocaleString()}`,
                color: "text-emerald-400",
              },
              {
                label: "Risk / trade",
                value: `${session.user.riskTolerance}%`,
                color: "text-slate-100",
              },
              {
                label: "Assets",
                value: "27 markets",
                color: "text-slate-100",
              },
              {
                label: "Status",
                value: "Paper trading",
                color: "text-amber-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex min-w-[90px] flex-col border-r border-slate-800 px-3 sm:px-5 py-3 last:border-r-0"
              >
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`mt-0.5 text-xs sm:text-sm font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="sticky top-[57px] z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-2 sm:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 border-b-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-[10px] sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6">

        {/* ════ OVERVIEW TAB ════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Asset table — full width */}
            <AssetDashboard
              accessToken={token}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={(sym) => {
                setSelectedSymbol(sym);
                setActiveTab("chart");
              }}
            />

            {/* Signal + Sentiment */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SignalPanel symbol={selectedSymbol} accessToken={token} />
              <SentimentPanel />
            </div>

            {/* Chat */}
            <ChatPanel accessToken={token} selectedSymbol={selectedSymbol} />
          </div>
        )}

        {/* ════ CHART TAB ════ */}
        {activeTab === "chart" && (
          <div className="space-y-6">
            {selectedSymbol ? (
              <>
                <CandlestickChart symbol={selectedSymbol} accessToken={token} />
                <MTFSignalPanel symbol={selectedSymbol} accessToken={token} />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-16 text-center">
                <p className="text-4xl">📈</p>
                <p className="mt-4 text-lg font-semibold text-slate-300">No asset selected</p>
                <p className="mt-2 text-sm text-slate-500">
                  Go to the Overview tab and click any asset row to open its chart.
                </p>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="mt-6 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Browse markets
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════ SIGNALS TAB ════ */}
        {activeTab === "signals" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <SignalPanel symbol={selectedSymbol} accessToken={token} />
              <MTFSignalPanel symbol={selectedSymbol} accessToken={token} />
            </div>
            <BacktestPanel accessToken={token} selectedSymbol={selectedSymbol} />
          </div>
        )}

        {/* ════ TRADING TAB ════ */}
        {activeTab === "trading" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <PaperTradingPanel accessToken={token} selectedSymbol={selectedSymbol} />
              <RiskPanel accessToken={token} selectedSymbol={selectedSymbol} />
            </div>
            <TradeJournalPanel accessToken={token} />
          </div>
        )}

        {/* ════ PORTFOLIO TAB ════ */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <PortfolioPanel accessToken={token} />
            <TradeJournalPanel accessToken={token} />
          </div>
        )}

        {/* ════ ALERTS TAB ════ */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AlertsPanel accessToken={token} selectedSymbol={selectedSymbol} />
              <SentimentPanel />
            </div>
            <ChatPanel accessToken={token} selectedSymbol={selectedSymbol} />
          </div>
        )}

        {/* ════ COMMUNITY TAB ════ */}
        {activeTab === "community" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <CommunityPanel
                accessToken={token}
                selectedSymbol={selectedSymbol}
                userEmail={session.user.email ?? ""}
              />
              <SentimentPanel />
            </div>
          </div>
        )}

        {/* ════ AI TOOLS TAB ════ */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            <BriefingPanel accessToken={token} />
            <div className="grid gap-6 lg:grid-cols-2">
              <TradePlannerPanel accessToken={token} selectedSymbol={selectedSymbol} />
              <NewsImpactPanel accessToken={token} />
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-slate-600">
          AI Trading Copilot · For educational purposes only · Not financial advice
        </p>
      </main>
    </div>
  );
}
