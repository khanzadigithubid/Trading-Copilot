import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiFetch } from "./api";

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
