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
    async jwt({ token, user }) {
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

export default nextAuth;
export const { auth, signIn, signOut } = nextAuth;
