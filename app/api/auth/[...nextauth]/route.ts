// /app/api/auth/[...nextauth]/route.ts
import { handlers } from "../../../../src/lib/auth";

export const { GET, POST } = handlers;

// Prisma Client Edge'de çalışmaz, Node.js runtime kullan
export const runtime = "nodejs";