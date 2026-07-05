import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Credentials provider added in auth.ts
  callbacks: {
    authorized: () => true,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.status = (user as any).status;
      }
      
      // Support session updates for profile modifications
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.picture = session.picture || token.picture;
        if (session.role) token.role = session.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "32charactersecretfornextauthdashboarddevsecret"
} satisfies NextAuthConfig;
