import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle sitemap.xml
  if (pathname === '/sitemap.xml') {
    const storeId = searchParams.get('storeId');
    if (storeId) {
      return NextResponse.rewrite(new URL(`/api/sitemap.xml?domain=${host}&storeId=${storeId}`, request.url));
    }
  }

  // Handle robots.txt
  if (pathname === '/robots.txt') {
    const storeId = searchParams.get('storeId');
    if (storeId) {
      return NextResponse.rewrite(new URL(`/api/robots.txt?domain=${host}&storeId=${storeId}`, request.url));
    }
  }

  // Store resolution logic
  let storeId: string | null = null;
  let storeSlug: string | null = null;

  // Check if this is a custom domain
  if (!host.includes('localhost') && !host.includes('vercel.app') && !host.includes('netlify.app')) {
    // This is a custom domain, try to resolve store
    try {
      // In a real implementation, you would query the database here
      // For now, we'll use a simple mapping or API call
      const domainResponse = fetch(`${process.env.API_GATEWAY_URL}/api/domains/resolve?domain=${host}`);
      const domainData = domainResponse.then(res => res.json());
      
      if (domainData) {
        storeId = domainData.storeId;
      }
    } catch (error) {
      console.error('Domain resolution error:', error);
    }
  }

  // If no store found by domain, try slug-based routing
  if (!storeId) {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      storeSlug = pathSegments[0];
      // Try to resolve store by slug
      try {
        const storeResponse = fetch(`${process.env.API_GATEWAY_URL}/api/stores/by-slug/${storeSlug}`);
        const storeData = storeResponse.then(res => res.json());
        
        if (storeData) {
          storeId = storeData.id;
        }
      } catch (error) {
        console.error('Store resolution error:', error);
      }
    }
  }

  // If we have a store, rewrite to the appropriate page
  if (storeId) {
    // Handle store pages (dynamic routes)
    if (pathname.startsWith(`/${storeSlug}/`) || (!storeSlug && pathname !== '/')) {
      const remainingPath = storeSlug ? pathname.replace(`/${storeSlug}`, '') : pathname;
      
      if (remainingPath === '/' || remainingPath === '') {
        // Homepage
        return NextResponse.rewrite(new URL(`/store/${storeId}`, request.url));
      } else {
        // Dynamic store page
        return NextResponse.rewrite(new URL(`/store/${storeId}/[...path]?path=${remainingPath}`, request.url));
      }
    }
  }

  // Handle store-specific sitemap and robots
  if (storeId) {
    if (pathname === '/sitemap.xml') {
      return NextResponse.rewrite(new URL(`/api/sitemap.xml?domain=${host}&storeId=${storeId}`, request.url));
    }
    
    if (pathname === '/robots.txt') {
      return NextResponse.rewrite(new URL(`/api/robots.txt?domain=${host}&storeId=${storeId}`, request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
