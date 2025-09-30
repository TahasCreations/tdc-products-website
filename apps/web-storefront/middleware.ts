import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Check if this is a custom domain request
    const isCustomDomain = !hostname.includes('vercel.app') && 
                          !hostname.includes('localhost') && 
                          !hostname.includes('127.0.0.1');

    if (isCustomDomain) {
      // Resolve store by domain
      const storeDomain = await prisma.storeDomain.findFirst({
        where: {
          domain: hostname,
          status: 'VERIFIED'
        },
        include: {
          store: {
            include: {
              tenant: true
            }
          }
        }
      });

      if (storeDomain) {
        // Add store and tenant information to headers
        const response = NextResponse.next();
        
        response.headers.set('x-store-id', storeDomain.storeId);
        response.headers.set('x-tenant-id', storeDomain.tenantId);
        response.headers.set('x-store-slug', storeDomain.store.slug);
        response.headers.set('x-store-name', storeDomain.store.name);
        response.headers.set('x-domain-id', storeDomain.id);
        
        // Set tenant context for the request
        response.headers.set('x-tenant-context', JSON.stringify({
          tenantId: storeDomain.tenantId,
          storeId: storeDomain.storeId,
          storeSlug: storeDomain.store.slug,
          storeName: storeDomain.store.name,
          domain: hostname,
          isCustomDomain: true
        }));

        return response;
      } else {
        // Domain not found, redirect to main site or show 404
        return NextResponse.redirect(new URL('/404', request.url));
      }
    } else {
      // This is a subdomain or main domain request
      // Check if it's a store slug route
      const pathSegments = pathname.split('/').filter(Boolean);
      
      if (pathSegments.length > 0) {
        const potentialSlug = pathSegments[0];
        
        // Check if this slug belongs to a store
        const store = await prisma.store.findFirst({
          where: {
            slug: potentialSlug,
            status: 'ACTIVE',
            isPublished: true
          },
          include: {
            tenant: true
          }
        });

        if (store) {
          // This is a store route, add store context
          const response = NextResponse.next();
          
          response.headers.set('x-store-id', store.id);
          response.headers.set('x-tenant-id', store.tenantId);
          response.headers.set('x-store-slug', store.slug);
          response.headers.set('x-store-name', store.name);
          
          // Set tenant context for the request
          response.headers.set('x-tenant-context', JSON.stringify({
            tenantId: store.tenantId,
            storeId: store.id,
            storeSlug: store.slug,
            storeName: store.name,
            domain: hostname,
            isCustomDomain: false,
            isStoreRoute: true
          }));

          return response;
        }
      }
    }

    // No store found, continue with normal routing
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, continue with normal routing
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

