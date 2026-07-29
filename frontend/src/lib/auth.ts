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
      }
      return token;
    },
    async session({ session, token }) {
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
