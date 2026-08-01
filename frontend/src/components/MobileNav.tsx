"use client";

import Link from "next/link";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
  icon?: string;
}

interface MobileNavProps {
  links: NavLink[];
  showAuth?: boolean;
}

export default function MobileNav({ links, showAuth = true }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex sm:hidden flex-col gap-1.5 p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
        aria-label="Menu"
      >
        <span className={`block h-0.5 w-5 bg-slate-300 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block h-0.5 w-5 bg-slate-300 transition-all ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 bg-slate-300 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu drawer */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-72 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                  AI
                </div>
                <span className="font-semibold text-slate-100">Trading Copilot</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition"
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons */}
            {showAuth && (
              <div className="border-t border-slate-800 p-4 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl border border-slate-700 py-2.5 text-center text-sm text-slate-300 hover:bg-slate-800 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl bg-emerald-500 py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
                >
                  Get started free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
