// /app/api/auth/[...nextauth]/route.ts
import nextAuth from "@/lib/auth";

export const { GET, POST } = nextAuth as any;

// Prisma Client Edge'de çalışmaz, Node.js runtime kullan
export const runtime = "nodejs";