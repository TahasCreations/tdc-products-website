import { prisma } from "@/lib/prisma";
import { serveAdsForQuery } from "./ads";

export async function searchProducts(query: string, limit = 24) {
  const queryStr = String(query || "").trim();
  
  // 1) sponsorlu ürünler
  const sponsored = await serveAdsForQuery(queryStr, 3); // ilk 3 slot
  
  // 2) organik (basit)
  const organic = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: queryStr } },
        { category: { contains: queryStr } }
      ],
      stock: { gt: 0 }
    },
    take: limit,
    include: {
      seller: true
    }
  });
  
  return { sponsored, organic };
}
