export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/guards";
import { aiGenerateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER", "ADMIN");

  const { url, title, description, content } = await req.json();
  if (!url) {
    return new Response("bad_request", { status: 400 });
  }

  const system = `Sen bir SEO uzmanısın. Verilen web sayfası bilgilerini analiz ederek SEO skoru ve öneriler sun.

Çıktı formatı (JSON):
{
  "score": number (0-100),
  "issues": [
    {"type": "error|warning|info", "title": "string", "description": "string"}
  ],
  "keywords": [
    {"keyword": "string", "density": "string", "position": number, "volume": number}
  ],
  "suggestions": ["string"],
  "technical": {
    "titleLength": number,
    "descriptionLength": number,
    "headingStructure": "string",
    "imageAltTexts": number
  }
}`;

  const userPrompt = `
WEB SAYFASI BİLGİLERİ:
- URL: ${url}
- Title: ${title || 'Yok'}
- Description: ${description || 'Yok'}
- Content: ${content ? content.substring(0, 1000) + '...' : 'Yok'}

Türkçe SEO standartlarına göre analiz yap ve öneriler sun.`;

  try {
    const result = await aiGenerateText(system, userPrompt);
    const parsed = JSON.parse(result);
    
    return Response.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("SEO analysis error:", error);
    return new Response("ai_error", { status: 500 });
  }
}
