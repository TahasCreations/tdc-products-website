export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/guards";
import { aiGenerateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { category, productId, timeframe = "12months" } = await req.json();
  if (!category) {
    return new Response("bad_request", { status: 400 });
  }

  const system = `Sen bir e-ticaret tahmin uzmanısın. Verilen kategori ve ürün için gelecek tahminleri yap.

Çıktı formatı (JSON):
{
  "salesForecast": {
    "nextMonth": number,
    "nextQuarter": number,
    "nextYear": number,
    "confidence": number
  },
  "trends": [
    {
      "period": "string",
      "trend": "string",
      "impact": "positive|negative|neutral",
      "probability": number
    }
  ],
  "risks": [
    {"type": "string", "probability": number, "impact": "high|medium|low", "mitigation": "string"}
  ],
  "opportunities": [
    {"type": "string", "timing": "string", "potential": "high|medium|low", "action": "string"}
  ],
  "recommendations": ["string"]
}`;

  const userPrompt = `
TAHMİN ANALİZİ:
- Kategori: ${category}
- Ürün ID: ${productId || 'Kategori geneli'}
- Zaman Aralığı: ${timeframe}

Türk e-ticaret pazarı için gelecek tahminleri ve stratejik öneriler sun.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Predictions error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
