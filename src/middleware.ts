import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin routes protection (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const adminAuth = request.cookies.get('adminAuth')?.value;
    
    if (!adminAuth || adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
