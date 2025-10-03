import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Admin sayfaları koruması
  if (url.pathname.startsWith("/admin")) {
    const session = await auth();
    
    if (!session?.user) {
      url.pathname = "/giris";
      return NextResponse.redirect(url);
    }
    
    if (session.user.role !== "ADMIN") {
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }
  
  // Seller sayfaları koruması
  if (url.pathname.startsWith("/seller")) {
    const session = await auth();
    
    if (!session?.user) {
      url.pathname = "/giris";
      return NextResponse.redirect(url);
    }
    
    // Seller dashboard ve yönetim sayfaları için SELLER veya ADMIN rolü gerekli
    if (url.pathname.startsWith("/seller/dashboard") || 
        url.pathname.startsWith("/seller/products") ||
        url.pathname.startsWith("/seller/orders") ||
        url.pathname.startsWith("/seller/analytics")) {
      
      if (!["SELLER", "ADMIN"].includes(session.user.role ?? "BUYER")) {
        url.pathname = "/seller/apply";
        return NextResponse.redirect(url);
      }
    }
    
    // Seller başvuru sayfası için herhangi bir kullanıcı erişebilir
    // (zaten yukarıda auth kontrolü yapıldı)
  }
  
  // Profile sayfaları koruması
  if (url.pathname.startsWith("/profile")) {
    const session = await auth();
    
    if (!session?.user) {
      url.pathname = "/giris";
      return NextResponse.redirect(url);
    }
  }
  
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
