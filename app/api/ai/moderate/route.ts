export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { aiGenerateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "BUYER";
  if (!session?.user || !["SELLER","ADMIN"].includes(role)) return new Response("forbidden", { status: 403 });

  const { text } = await req.json();
  if (!text) return new Response("bad_request", { status: 400 });

  const system = "You are a content safety filter. Return JSON with fields: {allowed:boolean, reasons:string[]}. Block scams, harassment, explicit sexual content, hate speech, and dangerous content according to enterprise policy.";
  const result = await aiGenerateText(system, `TEXT:\n${text}\n\nRespond in Turkish.`);

  return Response.json({ result });
}
