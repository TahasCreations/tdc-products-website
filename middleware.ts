/**
 * Next.js Middleware
 * 
 * Handles:
 * - Rate limiting for API routes
 * - Authentication checks (TODO)
 * - Request logging
 * 
 * @module middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, RATE_LIMITS } from "./lib/middleware/rate-limit";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  
  // ===================================
  // RATE LIMITING
  // ===================================
  
  // Auth endpoints (login, register, password reset)
  if (path.startsWith("/api/auth/register") || 
      path.startsWith("/api/auth/login") ||
      path.startsWith("/api/auth/reset")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.AUTH);
    if (rateLimited) return rateLimited;
  }
  
  // Search endpoints
  else if (path.startsWith("/api/search") || 
           path.startsWith("/api/products/search")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.SEARCH);
    if (rateLimited) return rateLimited;
  }
  
  // Payment endpoints
  else if (path.startsWith("/api/payment") || 
           path.startsWith("/api/checkout")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.PAYMENT);
    if (rateLimited) return rateLimited;
  }
  
  // Upload endpoints
  else if (path.startsWith("/api/upload") || 
           path.startsWith("/api/media")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.UPLOAD);
    if (rateLimited) return rateLimited;
  }
  
  // Admin endpoints (more lenient)
  else if (path.startsWith("/api/admin")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.ADMIN);
    if (rateLimited) return rateLimited;
  }
  
  // Default rate limit for other API routes
  else if (path.startsWith("/api/")) {
    const rateLimited = await rateLimit(req, RATE_LIMITS.DEFAULT);
    if (rateLimited) return rateLimited;
  }
  
  // ===================================
  // AUTHENTICATION (TODO)
  // ===================================
  // Simplified middleware without auth for now
  // TODO: Implement proper auth middleware
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // API routes for rate limiting
    "/api/:path*",
    // Protected pages
    "/(admin)/:path*",
    "/(dashboard)/seller/:path*",
    "/(dashboard)/influencer/:path*",
    "/profile/:path*"
  ],
};
