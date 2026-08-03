import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      accessToken: string;
      riskTolerance: number;
      capital: number;
    };
    error?: string;
  }

  interface User {
    accessToken: string;
    riskTolerance: number;
    capital: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    riskTolerance?: number;
    capital?: number;
    issuedAt?: number;
    error?: string;
  }
}
