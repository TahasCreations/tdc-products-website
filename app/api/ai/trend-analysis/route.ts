export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/guards";
import { aiGenerateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { category, timeframe = "3months", keywords = [] } = await req.json();
  if (!category) {
    return new Response("bad_request", { status: 400 });
  }

  const system = `Sen bir e-ticaret trend analiz uzmanısın. Verilen kategori ve anahtar kelimeler için trend analizi yap.

Çıktı formatı (JSON):
{
  "trends": [
    {
      "keyword": "string",
      "trend": "rising|stable|declining",
      "growthRate": number,
      "seasonality": "string",
      "opportunity": "high|medium|low"
    }
  ],
  "insights": [
    {"type": "opportunity|warning|info", "title": "string", "description": "string"}
  ],
  "recommendations": ["string"],
  "marketSize": {
    "current": number,
    "projected": number,
    "growth": number
  }
}`;

  const userPrompt = `
TREND ANALİZİ İSTEĞİ:
- Kategori: ${category}
- Zaman Aralığı: ${timeframe}
- Anahtar Kelimeler: ${keywords.join(', ') || 'Kategori geneli'}

Türk e-ticaret pazarı için trend analizi yap ve fırsatları belirle.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Trend analysis error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
