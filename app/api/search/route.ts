export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { searchProducts } from "@/src/lib/search";
import { serveAdsForQuery } from "@/src/lib/ads";
import { checkRateLimit, getRateLimitHeaders } from "@/src/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip, 60, 60000)) {
    return new Response("rate_limited", { 
      status: 429,
      headers: getRateLimitHeaders(ip)
    });
  }
  const { q, limit = 24 } = await req.json();
  const query = String(q || "").trim();
  
  if (!query) {
    return Response.json({ items: [] });
  }
  
  // Sponsorlu ürünler (en fazla 3)
  const sponsored = await serveAdsForQuery(query, 3);
  
  // Organik ürünler
  const { organic } = await searchProducts(query, limit);
  
  // Karışık sonuçlar
  const items = [
    // Sponsorlu ürünler en üstte
    ...sponsored.map(ad => ({
      type: "ad" as const,
      productId: ad.productId,
      campaignId: ad.campaignId,
      cpc: ad.cpc,
      label: "Reklam"
    })),
    // Organik ürünler
    ...organic.map(product => ({
      type: "organic" as const,
      productId: product.id,
      product: product
    }))
  ];
  
  return Response.json({ items });
}
