export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { bucket } from "@/lib/gcs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_MB = 10;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role ?? "BUYER";
    
    if (!session?.user || !["SELLER", "ADMIN"].includes(role)) {
      return new Response("forbidden", { status: 403 });
    }

    const { fileName, contentType, size, prefix = "products" } = await req.json();
    
    if (!fileName || !contentType) {
      return new Response("bad_request", { status: 400 });
    }
    
    if (!ALLOWED.includes(contentType)) {
      return new Response("unsupported_type", { status: 415 });
    }
    
    if (size && size > MAX_MB * 1024 * 1024) {
      return new Response("too_large", { status: 413 });
    }

    const safe = String(fileName).replace(/[^\w.\-]+/g, "_");
    const objectPath = `${prefix}/${crypto.randomUUID()}-${safe}`;

    const [uploadUrl] = await bucket.file(objectPath).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000,
      contentType,
    });

    return Response.json({ 
      uploadUrl, 
      objectPath, 
      maxBytes: MAX_MB * 1024 * 1024 
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate signed URL" }), { status: 500 });
  }
}
