"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface RecentUser {
  email: string;
  joined: string;
  trade_count: number;
  signal_count: number;
}

interface AdminStats {
  total_users: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
  recent_users: RecentUser[];
  total_trades: number;
  total_signals: number;
  total_community_signals: number;
  open_trades: number;
  closed_trades: number;
  top_assets_traded: { symbol: string; count: number }[];
  top_assets_signaled: { symbol: string; count: number }[];
  generated_at: string;
}

function StatCard({
  label,
  value,
  sub,
  color = "text-emerald-400",
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className={`mt-1.5 text-3xl font-bold font-mono ${color}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.accessToken) return;
    apiFetch<AdminStats>("/admin/stats", {}, session.user.accessToken)
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Access denied"))
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-slate-400 text-sm">Loading admin stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🔒</span>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-400">{error}</p>
        <Link href="/dashboard" className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm">AI</div>
            <div>
              <p className="text-xs text-emerald-400 uppercase tracking-widest">Admin</p>
              <p className="text-base font-semibold leading-tight">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Updated: {new Date(stats.generated_at).toLocaleTimeString()}
            </span>
            <Link href="/dashboard" className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800 transition">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">

        {/* User Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">👥 User Growth</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={stats.total_users} icon="👥" color="text-emerald-400" sub="All time" />
            <StatCard label="New Today" value={stats.new_today} icon="🌅" color="text-blue-400" sub="Last 24 hours" />
            <StatCard label="New This Week" value={stats.new_this_week} icon="📅" color="text-violet-400" sub="Last 7 days" />
            <StatCard label="New This Month" value={stats.new_this_month} icon="📆" color="text-amber-400" sub="Last 30 days" />
          </div>
        </section>

        {/* Activity Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">📊 Platform Activity</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Paper Trades" value={stats.total_trades} icon="💼" sub={`${stats.open_trades} open · ${stats.closed_trades} closed`} />
            <StatCard label="AI Signals Generated" value={stats.total_signals} icon="🤖" color="text-emerald-400" sub="Including cached" />
            <StatCard label="Community Signals" value={stats.total_community_signals} icon="👥" color="text-violet-400" sub="User shared" />
          </div>
        </section>

        {/* Top Assets */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold mb-4">🔥 Most Traded Assets</h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {stats.top_assets_traded.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No trades yet.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {stats.top_assets_traded.map((asset, i) => (
                    <div key={asset.symbol} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500"}`}>
                          #{i + 1}
                        </span>
                        <span className="font-semibold text-slate-100">{asset.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 rounded-full bg-emerald-500/30" style={{ width: `${(asset.count / stats.top_assets_traded[0].count) * 80}px` }}>
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: "100%" }} />
                        </div>
                        <span className="text-sm font-mono text-emerald-400 w-16 text-right">{asset.count} trades</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">🤖 Most Signaled Assets</h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {stats.top_assets_signaled.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No signals yet.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {stats.top_assets_signaled.map((asset, i) => (
                    <div key={asset.symbol} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500"}`}>
                          #{i + 1}
                        </span>
                        <span className="font-semibold text-slate-100">{asset.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 rounded-full bg-blue-500/30" style={{ width: `${(asset.count / stats.top_assets_signaled[0].count) * 80}px` }}>
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: "100%" }} />
                        </div>
                        <span className="text-sm font-mono text-blue-400 w-16 text-right">{asset.count} signals</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Users */}
        <section>
          <h2 className="text-lg font-semibold mb-4">🆕 Recent Signups</h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-800 text-slate-500 text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Email</th>
                    <th className="px-5 py-3 text-left font-medium">Joined</th>
                    <th className="px-5 py-3 text-right font-medium">Trades</th>
                    <th className="px-5 py-3 text-right font-medium">Signals Shared</th>
                    <th className="px-5 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recent_users.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-900/60 transition">
                      <td className="px-5 py-3 font-medium text-slate-100">{user.email}</td>
                      <td className="px-5 py-3 text-slate-400">{user.joined}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-mono ${user.trade_count > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                          {user.trade_count}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-mono ${user.signal_count > 0 ? "text-violet-400" : "text-slate-500"}`}>
                          {user.signal_count}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.trade_count > 0 || user.signal_count > 0
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-slate-700/50 text-slate-500"
                        }`}>
                          {user.trade_count > 0 || user.signal_count > 0 ? "Active" : "New"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stats.recent_users.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-500">No users yet.</p>
            )}
          </div>
        </section>

        {/* Vercel Analytics note */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="font-semibold text-emerald-400">📡 Vercel Analytics</h2>
          <p className="mt-2 text-sm text-slate-300">
            Page views, unique visitors, countries, and devices are tracked automatically via Vercel Analytics.
          </p>
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            View Vercel Analytics →
          </a>
        </section>

        <p className="text-center text-xs text-slate-600">
          Admin panel · Only visible to {session?.user?.email}
        </p>
      </main>
    </div>
  );
}
