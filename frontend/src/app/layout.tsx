import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
