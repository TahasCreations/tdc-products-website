import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Simplified middleware without auth for now
  // TODO: Implement proper auth middleware
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(admin)/:path*",
    "/(dashboard)/seller/:path*",
    "/(dashboard)/influencer/:path*",
    "/profile/:path*"
  ],
};
