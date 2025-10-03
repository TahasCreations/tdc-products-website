export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/src/lib/guards";
import { aiGenerateText } from "@/src/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { imageUrl, productTitle, category } = await req.json();
  if (!imageUrl) {
    return new Response("bad_request", { status: 400 });
  }

  const system = `Sen bir e-ticaret görsel kalite uzmanısın. Ürün görsellerini analiz ederek kalite değerlendirmesi yap.

Çıktı formatı (JSON):
{
  "overallScore": number (0-100),
  "technicalQuality": {
    "resolution": "high|medium|low",
    "lighting": "excellent|good|fair|poor",
    "composition": "excellent|good|fair|poor",
    "sharpness": "excellent|good|fair|poor"
  },
  "ecommerceOptimization": {
    "background": "suitable|needs_improvement",
    "productVisibility": "excellent|good|fair|poor",
    "colorAccuracy": "excellent|good|fair|poor",
    "brandConsistency": "excellent|good|fair|poor"
  },
  "issues": [
    {"type": "technical|composition|ecommerce", "severity": "high|medium|low", "description": "string", "fix": "string"}
  ],
  "recommendations": ["string"],
  "competitorComparison": {
    "score": number,
    "strengths": ["string"],
    "improvements": ["string"]
  }
}`;

  const userPrompt = `
GÖRSEL KALİTE ANALİZİ:
- Görsel URL: ${imageUrl}
- Ürün Başlığı: ${productTitle || 'Bilinmiyor'}
- Kategori: ${category || 'Bilinmiyor'}

E-ticaret standartlarına göre görsel kalite analizi yap ve iyileştirme önerileri sun.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Visual quality analysis error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
