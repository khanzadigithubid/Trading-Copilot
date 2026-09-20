import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import ChatWidget from "@/components/ChatWidget";
import Providers from "@/components/Providers";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Arabic font — loaded via next/font (no 404, no preload warnings)
const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-arabic",
  display: "swap",
  preload: false, // only load when Arabic is selected
});

export const metadata: Metadata = {
  title: "AI Trading Copilot",
  description:
    "Multi-market AI trading assistant — explainable signals, risk management, and natural language insights for Forex, Crypto, Stocks & Commodities.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TradeCopilot",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "AI Trading Copilot",
    description: "Explainable AI signals for Forex, Crypto, Stocks & Commodities.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang and dir stay as defaults — I18nProvider updates them client-side via useEffect
    // This avoids React hydration mismatch (#418/#423/#425)
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${notoKufiArabic.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <PWAInstallPrompt />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
