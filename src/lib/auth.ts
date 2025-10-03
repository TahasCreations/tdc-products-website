// /lib/auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const nextAuth = NextAuth({
  // adapter: PrismaAdapter(prisma), // Temporarily disabled for build
  session: { strategy: "jwt" }, // JWT session for now
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // DB session: user nesnesi DB'den gelir, role sahiptir
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role; // Role enumu
      }
      return session;
    },
  },
});

export default nextAuth;
export const { auth, signIn, signOut } = nextAuth;
