import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // Check if admin is authenticated
    const adminAuth = request.cookies.get('adminAuth')?.value;
    
    if (!adminAuth || adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
  ],
};
