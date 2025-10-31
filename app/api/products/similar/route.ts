export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/guards";
impimport { prisma } from '@/lib/prisma';
ort { aiEmbed } from "@/lib/ai";
// Basit yaklaşım: mevcut ürün başlıklarına embedding olmadan hızla cosine approx (LLM embed ile geliştir)
export async function POST(req: NextRequest) {
  await requireRole("SELLER","ADMIN");
  const { title, k=5 } = await req.json();
  if (!title) return new Response("bad_request", { status: 400 });

  // Geçici: sadece string benzerliği; ileride pgvector ile değiştirilecek
  const products = await prisma.product.findMany({ select: { id:true, title:true, slug:true } });
  // Embedding'e geçiş:
  const [qVec] = await aiEmbed([title]);
  // TODO: Eğer pgvector aktifse SQL ile cosine similarity sorgusu yap.
  // Şimdilik basit skorlama:
  const scored = products
    .map(p => ({ ...p, score: jaccard(title.toLowerCase(), p.title.toLowerCase()) }))
    .sort((a,b)=>b.score-a.score)
    .slice(0, k);
  return Response.json({ items: scored });
}

// küçük jaccard helper (geçici)
function jaccard(a:string, b:string) {
  const A = new Set(a.split(/\s+/)); const B = new Set(b.split(/\s+/));
  const inter = new Set([...A].filter(x => B.has(x))).size;
  const uni = new Set([...A, ...B]).size;
  return inter / (uni || 1);
}
