import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePrimaryImage(images?: string | null): string | null {
  if (!images) {
    return null;
  }

  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

function parseStringArray(value?: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // ignore parse errors
  }

  return [];
}

export const productSchema = z.object({
  title: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır."),
  description: z.string().min(10, "Ürün açıklaması en az 10 karakter olmalıdır."),
  category: z.string().min(1, "Kategori zorunludur."),
  subcategory: z.string().optional(),
  productType: z.enum(["PHYSICAL", "DIGITAL", "SERVICE"]).default("PHYSICAL"),
  price: z.coerce.number().min(0, "Fiyat negatif olamaz."),
  listPrice: z
    .union([z.coerce.number().min(0), z.literal(null)])
    .optional()
    .transform((value) => (value === null ? null : value)),
  stock: z.coerce.number().int().min(-1, "Stok -1 veya daha büyük olmalıdır."),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  attributes: z.record(z.string(), z.string()).optional(),
});

async function generateUniqueProductSlug(title: string) {
  const base = createSlug(title);
  let candidate = base;
  let i = 1;

  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${++i}`;
  }

  return candidate;
}

export function serializeProduct(product: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  productType: string;
  price: number;
  listPrice: number | null;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: string | null;
  tags: string | null;
  attributes: Record<string, unknown> | null;
}) {
  const imageList = parseStringArray(product.images);

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description ?? "",
    category: product.category,
    subcategory: product.subcategory,
    productType: product.productType,
    price: product.price,
    listPrice: product.listPrice,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    image: imageList[0] ?? null,
    images: imageList,
    tags: parseStringArray(product.tags),
    attributes: (product.attributes ?? {}) as Record<string, unknown>,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSize = Math.min(
      Math.max(Number.parseInt(searchParams.get("pageSize") ?? "20", 10), 1),
      100,
    );
    const skip = (page - 1) * pageSize;

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim()?.toLowerCase() ?? "all";

    const where: any = {
      sellerId: sellerProfile.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    } else if (status === "outofstock") {
      where.stock = { lte: 0 };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          subcategory: true,
          productType: true,
          price: true,
          listPrice: true,
          stock: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          tags: true,
          attributes: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const data = products.map((product) => serializeProduct(product));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Seller products error:", error);
    return NextResponse.json(
      { success: false, error: "Ürün listesi yüklenemedi." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz ürün verisi",
          issues: parsed.error.flatten(),
        },
        { status: 422 },
      );
    }

    const payload = parsed.data;
    const slug = await generateUniqueProductSlug(payload.title);
    const images = payload.images.filter((img) => !!img && img.trim().length > 0);
    const tags = payload.tags.filter((tag) => !!tag && tag.trim().length > 0);

    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        title: payload.title,
        slug,
        description: payload.description,
        category: payload.category,
        subcategory: payload.subcategory ?? null,
        productType: payload.productType,
        price: payload.price,
        listPrice: payload.listPrice ?? null,
        stock: payload.stock,
        images: JSON.stringify(images),
        tags: JSON.stringify(tags),
        attributes: payload.attributes ?? {},
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        subcategory: true,
        productType: true,
        price: true,
        listPrice: true,
        stock: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        images: true,
        tags: true,
        attributes: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: serializeProduct(product),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Seller products create error:", error);
    return NextResponse.json(
      { success: false, error: "Ürün kaydedilemedi." },
      { status: 500 },
    );
  }
}


