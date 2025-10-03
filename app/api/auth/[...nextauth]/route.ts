// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "../../../../src/lib/auth";

export const { GET, POST } = NextAuth;

// Prisma Client Edge'de çalışmaz, Node.js runtime kullan
export const runtime = "nodejs";