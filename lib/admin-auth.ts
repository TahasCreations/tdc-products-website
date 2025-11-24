import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface AdminTokenPayload {
  email?: string;
  userId?: string;
  role?: string;
  isAdmin?: boolean;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "tdc-admin-secret-key-change-in-production";

const secret = new TextEncoder().encode(JWT_SECRET);

export async function requireAdmin(req: NextRequest): Promise<AdminTokenPayload> {
  const token = req.cookies.get("admin-token")?.value;

  if (!token) {
    throw new AdminAuthError("UNAUTHORIZED", "Yönetici oturumu bulunamadı.");
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload?.isAdmin || payload?.role !== "ADMIN") {
      throw new AdminAuthError("FORBIDDEN", "Yetkisiz erişim.");
    }

    return payload as AdminTokenPayload;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error;
    }
    throw new AdminAuthError("UNAUTHORIZED", "Geçersiz veya süresi dolmuş oturum.");
  }
}

export class AdminAuthError extends Error {
  code: "UNAUTHORIZED" | "FORBIDDEN";

  constructor(code: "UNAUTHORIZED" | "FORBIDDEN", message: string) {
    super(message);
    this.code = code;
  }
}




