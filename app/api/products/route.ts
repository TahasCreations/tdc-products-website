export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { cached, invalidationMatrix } from "@/lib/api-cache";
import { withMetric, createRequestLogger } from "@/lib/monitoring";
import { CACHE_TTL } from "@/lib/redis";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const logger = createRequestLogger(req);
  
  try {
    const session = await auth();
    const role = (session?.user as any)?.role ?? "BUYER";
    
    if (!session?.user) {
      return new Response("auth_required", { status: 401 });
    }
    
    if (!["SELLER", "ADMIN"].includes(role)) {
      return new Response("forbidden", { status: 403 });
    }

    const { 
      title, 
      slug, 
      category, 
      subcategory,
      price, 
      stock = 0, 
      images = [], 
      attributes = {},
      description
    } = await req.json();
    
    if (!title || !slug || !category || !price || !images.length) {
      return new Response("missing_fields", { status: 400 });
    }

    // Satıcı profilini bul
    const seller = await withMetric('db.seller.findUnique', () =>
      prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
    );
    
    if (!seller) {
      return new Response("seller_profile_required", { status: 400 });
    }

    // Slug benzersizlik kontrolü
    const existingProduct = await withMetric('db.product.findUnique', () =>
      prisma.product.findUnique({
        where: { slug },
      })
    );
    
    if (existingProduct) {
      return new Response("slug_already_exists", { status: 400 });
    }

    // Ürünü oluştur
    const product = await withMetric('db.product.create', () =>
      prisma.product.create({
        data: { 
          title, 
          slug, 
          category, 
          subcategory: subcategory || null,
          price, 
          stock, 
          images, 
          attributes,
          description: description || null,
          sellerId: seller.id 
        },
      })
    );

    // Invalidate related caches
    await invalidationMatrix.product.update(product.id);
    
    logger.success({ productId: product.id, slug: product.slug });
    return Response.json({ ok: true, product });
  } catch (error) {
    logger.error(error as Error);
    console.error("Product creation error:", error);
    return new Response("internal_server_error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const logger = createRequestLogger(req);
  
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build cache key
    const cacheKey = `products:list:v1:p${page}:l${limit}:c${category || 'all'}:s${search || 'none'}`;

    // Use cached data with SWR
    const data = await cached(
      cacheKey,
      CACHE_TTL.MEDIUM, // 2 minutes fresh
      async () => {
        // Fetch from database with metrics
        return await withMetric('db.products.list', async () => {
          const where: any = {};
          
          if (category) {
            where.category = category;
          }
          
          if (search) {
            where.OR = [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ];
          }

          const products = await prisma.product.findMany({
            where,
            include: {
              seller: {
                select: {
                  storeName: true,
                  storeSlug: true,
                  rating: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
          });

          const total = await prisma.product.count({ where });

          return {
            products,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            }
          };
        });
      },
      {
        staleTtlSec: CACHE_TTL.STALE, // 6 minutes stale
        hotLimitPerSec: 300, // Max 300 requests per second to this key
      }
    );

    logger.success({ 
      productCount: data.products.length, 
      page, 
      cached: true 
    });
    
    return Response.json(data);
  } catch (error) {
    logger.error(error as Error);
    console.error("Product fetch error:", error);
    return new Response(JSON.stringify({ error: "internal_server_error" }), { status: 500 });
  }
}
