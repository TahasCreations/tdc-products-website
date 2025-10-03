export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole, requireEntitlement } from "@/lib/guards";
import { aiGenerateText, aiEmbed } from "@/lib/ai";

export async function POST(req: NextRequest) {
  await requireRole("SELLER","ADMIN");
  await requireEntitlement("keyword-tool");

  const { seed, locale="tr-TR" } = await req.json();
  if (!seed) return new Response("bad_request", { status: 400 });

  // 1) LLM ile öneriler
  const system = "You expand e-commerce SEO keywords. Output JSON: {primary:string[], longTail:string[], negatives:string[]}. Keep Turkish results for tr-TR.";
  const raw = await aiGenerateText(system, `Seed: ${seed}\nLocale: ${locale}`);
  
  // 2) Embedding'lerini hesapla (opsiyonel; benzerlik için)
  let parsed:any;
  try { parsed = JSON.parse(raw); } catch { parsed = { primary:[], longTail:[], negatives:[] }; }
  const all = [...(parsed.primary||[]), ...(parsed.longTail||[])];
  const vectors = await aiEmbed(all);
  
  return Response.json({ suggestions: parsed, vectorsCount: vectors.length });
}
