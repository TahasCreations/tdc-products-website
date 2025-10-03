export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/guards";
import { aiGenerateText } from "@/lib/ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { productId, currentPrice, category, title, description } = await req.json();
  if (!productId || !currentPrice) {
    return new Response("bad_request", { status: 400 });
  }

  // Ürün bilgilerini al
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product) {
    return new Response("product_not_found", { status: 404 });
  }

  // Benzer ürünleri al
  const similarProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: productId }
    },
    select: { title: true, price: true, rating: true, reviewCount: true },
    take: 10
  });

  const system = `Sen bir e-ticaret fiyat optimizasyon uzmanısın. Verilen ürün bilgileri ve benzer ürünlerin fiyatlarına bakarak optimal fiyat önerisi yap.

Çıktı formatı (JSON):
{
  "suggestedPrice": number,
  "confidence": number (0-100),
  "priceRange": {"min": number, "max": number},
  "factors": [
    {"factor": "string", "impact": "string", "description": "string"}
  ],
  "projections": {
    "salesIncrease": "string",
    "revenueIncrease": "string", 
    "profitIncrease": "string"
  },
  "reasoning": "string"
}`;

  const userPrompt = `
ÜRÜN BİLGİLERİ:
- Başlık: ${product.title}
- Kategori: ${product.category}
- Mevcut Fiyat: ₺${product.price}
- Açıklama: ${product.description || 'Yok'}
- Satıcı: ${product.seller.storeName}

BENZER ÜRÜNLER:
${similarProducts.map(p => `- ${p.title}: ₺${p.price} (${p.rating}/5, ${p.reviewCount} yorum)`).join('\n')}

Türk e-ticaret pazarı için optimal fiyat önerisi yap.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: {
        currentPrice: product.price,
        suggestedPrice: parsed.suggestedPrice,
        confidence: parsed.confidence,
        priceRange: parsed.priceRange,
        factors: parsed.factors,
        projections: parsed.projections,
        reasoning: parsed.reasoning
      }
    });
  } catch (error) {
    console.error("Price suggestion error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
