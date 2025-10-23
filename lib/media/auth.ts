import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export interface AdminUser {
  email: string;
  role: string;
  userId?: string;
  isAdmin: boolean;
}

export async function verifyAdminAuth(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'tdc-admin-secret-key-change-in-production'
    );

    const { payload } = await jwtVerify(token, secret);

    if (!payload.isAdmin || payload.role !== 'ADMIN') {
      return null;
    }

    return {
      email: payload.email as string,
      role: payload.role as string,
      userId: payload.userId as string | undefined,
      isAdmin: true
    };
  } catch (error) {
    return null;
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized. Admin access required.' }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export function createForbiddenResponse() {
  return new Response(
    JSON.stringify({ error: 'Forbidden. Insufficient permissions.' }),
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

