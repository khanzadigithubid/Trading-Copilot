import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiFetch } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json() as { access_token: string };
    return {
      ...token,
      accessToken: data.access_token,
      issuedAt: Date.now(),
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshFailed" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const tokenResponse = await apiFetch<{ access_token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const user = await apiFetch<{
            id: string;
            email: string;
            risk_tolerance: number;
            capital: number;
          }>("/auth/me", {}, tokenResponse.access_token);
          return {
            id: user.id,
            email: user.email,
            accessToken: tokenResponse.access_token,
            riskTolerance: user.risk_tolerance,
            capital: user.capital,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches backend
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // First sign in
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          riskTolerance: user.riskTolerance,
          capital: user.capital,
          issuedAt: Date.now(),
        };
      }

      // Token still fresh (less than 6 days old) — return as is
      const issuedAt = (token.issuedAt as number) ?? 0;
      const ageMs = Date.now() - issuedAt;
      const sixDays = 6 * 24 * 60 * 60 * 1000;

      if (ageMs < sixDays) return token;

      // Token near expiry — refresh it
      return refreshAccessToken(token as Record<string, unknown>);
    },
    async session({ session, token }) {
      if (token.error === "RefreshFailed") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...session, error: "RefreshFailed" } as any;
      }
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.accessToken = token.accessToken as string;
        session.user.riskTolerance = token.riskTolerance as number;
        session.user.capital = token.capital as number;
      }
      return session;
    },
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const tokenResponse = await apiFetch<{ access_token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await apiFetch<{
            id: string;
            email: string;
            risk_tolerance: number;
            capital: number;
          }>("/auth/me", {}, tokenResponse.access_token);

          return {
            id: user.id,
            email: user.email,
            accessToken: tokenResponse.access_token,
            riskTolerance: user.risk_tolerance,
            capital: user.capital,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 23, // 23 hours — slightly less than backend 24h expiry
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.riskTolerance = user.riskTolerance;
        token.capital = user.capital;
        token.issuedAt = Date.now();
      }

      // Re-validate token if older than 22 hours
      const issuedAt = (token.issuedAt as number) ?? 0;
      const ageHours = (Date.now() - issuedAt) / (1000 * 60 * 60);

      if (ageHours > 22 && token.accessToken) {
        // Token too old — mark as expired so session is cleared
        token.error = "TokenExpired";
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "TokenExpired") {
        // Force sign out by returning empty session
        return { ...session, error: "TokenExpired" };
      }
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.accessToken = token.accessToken as string;
        session.user.riskTolerance = token.riskTolerance as number;
        session.user.capital = token.capital as number;
      }
      return session;
    },
  },
};
