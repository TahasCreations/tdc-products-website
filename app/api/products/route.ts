export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    
    if (!seller) {
      return new Response("seller_profile_required", { status: 400 });
    }

    // Slug benzersizlik kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (existingProduct) {
      return new Response("slug_already_exists", { status: 400 });
    }

    // Ürünü oluştur
    const product = await prisma.product.create({
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
    });

    return Response.json({ ok: true, product });
  } catch (error) {
    console.error("Product creation error:", error);
    return new Response("internal_server_error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

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

    return Response.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return new Response(JSON.stringify({ error: "internal_server_error" }), { status: 500 });
  }
}
