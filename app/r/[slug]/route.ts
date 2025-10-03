export const runtime = "edge";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Collaboration'ı bul
    const collab = await prisma.collaboration.findUnique({
      where: { trackingSlug: slug },
      include: { product: { select: { slug: true } } }
    });

    if (!collab) {
      return new Response("Not Found", { status: 404 });
    }

    // Tıklamayı logla (şimdilik console)
    console.log(`Tracking click: ${slug} -> ${collab.product.slug}`);

    // Ürün sayfasına yönlendir
    return Response.redirect(new URL(`/products/${collab.product.slug}`, req.url));
  } catch (error) {
    console.error('Tracking error:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
