import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
    // lang and dir are updated client-side by I18nProvider via useEffect
    // Default is English LTR; Arabic will flip to RTL automatically
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Arabic font — loaded only when needed via CSS font-face */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <style>{`
          /* Arabic RTL font */
          @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
          [dir="rtl"] { font-family: 'Noto Kufi Arabic', var(--font-geist-sans), sans-serif; }
          [dir="rtl"] .ms-auto { margin-inline-start: auto; margin-inline-end: 0; }
        `}</style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <PWAInstallPrompt />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
