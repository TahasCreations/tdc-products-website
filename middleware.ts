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
                       hostname === 'www.tdcmarket.com' ||
                       hostname === 'tdcproductsonline.com' ||
                       hostname === 'www.tdcproductsonline.com' ||
                       hostname.includes('vercel.app');

  // If it's a custom domain, handle multi-tenant routing
  if (!isMainDomain) {
    try {
      // Query database to find verified domain
      // Note: In production, cache this lookup for performance
      const domainData = await fetch(`${request.nextUrl.origin}/api/domains/resolve?hostname=${hostname}`, {
        headers: {
          'x-internal-request': 'true'
        }
      }).then(res => res.json()).catch(() => null);
      
      if (domainData && domainData.seller) {
        // Valid custom domain found
        const response = NextResponse.next();
        response.headers.set('x-custom-domain', hostname);
        response.headers.set('x-is-custom-domain', 'true');
        response.headers.set('x-seller-id', domainData.seller.id);
        response.headers.set('x-seller-slug', domainData.seller.storeSlug);
        response.headers.set('x-store-name', domainData.seller.storeName);
        
        // Rewrite to the store page with seller context
        return NextResponse.rewrite(
          new URL(`/store/${domainData.seller.storeSlug}${pathname}`, request.url)
        );
      } else {
        // Domain not found or not verified
        return NextResponse.redirect(new URL('https://tdcmarket.com', request.url));
      }
    } catch (error) {
      console.error('Multi-tenant routing error:', error);
      // Fallback to main domain
      return NextResponse.redirect(new URL('https://tdcmarket.com', request.url));
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

  // Partner panel protection (Seller + Influencer + Multi-role support)
  if (pathname.startsWith('/partner')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/giris?redirect=/partner', request.url));
    }

    // Multi-role support: Check both role and roles fields
    const userRole = token.role as string;
    const userRoles = token.roles ? JSON.parse(token.roles as string) : [userRole];
    
    const hasPermission = ['SELLER', 'INFLUENCER', 'ADMIN'].some(role => 
      userRoles.includes(role)
    );
    
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // Legacy seller panel support
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
