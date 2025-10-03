export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/src/lib/guards";
import { aiGenerateText } from "@/src/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { category, region = "TR", timeframe = "6months" } = await req.json();
  if (!category) {
    return new Response("bad_request", { status: 400 });
  }

  const system = `Sen bir pazar zekası uzmanısın. E-ticaret kategorileri için detaylı pazar analizi yap.

Çıktı formatı (JSON):
{
  "marketOverview": {
    "size": number,
    "growth": number,
    "competition": "high|medium|low",
    "maturity": "emerging|growing|mature|declining"
  },
  "competitors": [
    {
      "name": "string",
      "marketShare": number,
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],
  "opportunities": [
    {"type": "string", "description": "string", "potential": "high|medium|low"}
  ],
  "threats": [
    {"type": "string", "description": "string", "severity": "high|medium|low"}
  ],
  "recommendations": ["string"]
}`;

  const userPrompt = `
PAZAR ZEKASI ANALİZİ:
- Kategori: ${category}
- Bölge: ${region}
- Zaman Aralığı: ${timeframe}

Türk e-ticaret pazarı için kapsamlı pazar zekası raporu hazırla.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Market intelligence error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
