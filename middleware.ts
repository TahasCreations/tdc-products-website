import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verifyAdminAuth } from './lib/media/auth';

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Get the hostname (domain)
  const currentHost = hostname.replace('.localhost:3000', '').replace('.vercel.app', '');
  
  // Check if this is a custom domain (not main domain)
  const isMainDomain = hostname === 'localhost' || 
                       hostname.includes('localhost:3000') ||
                       hostname === 'tdcmarket.com' ||
                       hostname.includes('vercel.app');

  // If it's a custom domain, handle multi-tenant routing
  if (!isMainDomain) {
    try {
      // In production, you would query your database here to find the seller
      // For now, we'll pass the hostname in headers
      const response = NextResponse.next();
      response.headers.set('x-custom-domain', hostname);
      response.headers.set('x-is-custom-domain', 'true');
      
      // Rewrite to the store page
      return NextResponse.rewrite(new URL(`/store/${currentHost}${pathname}`, request.url));
    } catch (error) {
      console.error('Multi-tenant routing error:', error);
    }
  }

  // Admin panel protection
  // Allow access to admin login page and API routes without middleware auth
  if (pathname.startsWith('/admin')) {
    // Allow admin login page
    if (pathname === '/admin') {
      return NextResponse.next();
    }
    
    // Allow admin API routes (they handle their own auth)
    if (pathname.startsWith('/admin/api') || pathname.startsWith('/api/admin')) {
      return NextResponse.next();
    }
    
    // For all other admin routes, verify admin auth
    const adminUser = await verifyAdminAuth(request);
    
    if (!adminUser || !adminUser.isAdmin) {
      // Redirect to admin login page instead of general login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Seller panel protection
  if (pathname.startsWith('/seller')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/giris?redirect=/seller', request.url));
    }

    const userRole = token.role as string;
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
