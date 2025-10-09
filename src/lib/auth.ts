// /lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const nextAuth = NextAuth({
  // adapter: PrismaAdapter(prisma), // Enable when DB sessions are desired
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If callbackUrl is explicitly set (from signIn call), use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If URL starts with /, it's a relative URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Default to base URL
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role || "BUYER";
      }
      // default role if missing
      if (!(token as any).role) (token as any).role = "BUYER";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).sub || (token as any).id;
        (session.user as any).role = (token as any).role || "BUYER";
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;
export default nextAuth;

// Export authOptions for API routes
export const authOptions = nextAuth;
