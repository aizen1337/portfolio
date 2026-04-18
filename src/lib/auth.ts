import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth";
import {
  getAdminGitHubLogins,
  getDevelopmentAdminEmail,
  getDevelopmentAdminLogin,
  isDevelopmentAdminBypassEnabled,
} from "@/lib/env";

export const authOptions: NextAuthOptions = {
  providers: process.env.GITHUB_ID && process.env.GITHUB_SECRET
    ? [
        GitHubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        }),
      ]
    : [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "login" in profile) {
        token.login = String(profile.login);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.login = typeof token.login === "string" ? token.login : null;
      }
      return session;
    },
    async signIn({ profile }) {
      const allowlist = getAdminGitHubLogins();
      const login =
        profile && "login" in profile ? String(profile.login).toLowerCase() : "";

      if (!allowlist.length) {
        return false;
      }

      return allowlist.includes(login);
    },
  },
  pages: {
    signIn: "/admin",
  },
};

function getDevelopmentAdminSession() {
  return {
    user: {
      name: "Development Admin",
      email: getDevelopmentAdminEmail(),
      login: getDevelopmentAdminLogin(),
    },
  };
}

export async function getAuthSession() {
  if (isDevelopmentAdminBypassEnabled()) {
    return getDevelopmentAdminSession();
  }

  return getServerSession(authOptions);
}
