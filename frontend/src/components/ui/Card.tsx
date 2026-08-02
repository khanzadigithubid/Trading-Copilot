"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "emerald" | "blue" | "violet" | "amber" | "red";
}

const glowMap = {
  emerald: "border-emerald-500/20 bg-emerald-500/5",
  blue:    "border-blue-500/20 bg-blue-500/5",
  violet:  "border-violet-500/20 bg-violet-500/5",
  amber:   "border-amber-500/20 bg-amber-500/5",
  red:     "border-red-500/20 bg-red-500/5",
};

export function Card({ children, className = "", glow }: CardProps) {
  const base = glow
    ? `rounded-2xl border ${glowMap[glow]} p-5 sm:p-6`
    : "rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6";
  return <div className={`${base} ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs sm:text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
