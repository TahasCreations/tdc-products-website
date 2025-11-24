import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";

import { serializeProduct, productSchema } from "../route";

const updateSchema = productSchema
  .partial()
  .extend({
    title: productSchema.shape.title.optional(),
    description: productSchema.shape.description.optional(),
    price: productSchema.shape.price.optional(),
    listPrice: productSchema.shape.listPrice.optional(),
    stock: productSchema.shape.stock.optional(),
    category: productSchema.shape.category.optional(),
    subcategory: productSchema.shape.subcategory.optional(),
    productType: productSchema.shape.productType.optional(),
    images: productSchema.shape.images.optional(),
    tags: productSchema.shape.tags.optional(),
    attributes: productSchema.shape.attributes.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Güncellenecek en az bir alan belirtmelisiniz.",
  });

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } },
) {
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

    if (!sellerProfile && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

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

    const product = await prisma.product.findFirst({
      where: {
        id: params.productId,
        ...(user.role === "ADMIN" ? {} : { sellerId: sellerProfile!.id }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sellerId: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }

    const payload = parsed.data;
    const dataToUpdate: any = {};

    if (payload.title && payload.title !== product.title) {
      dataToUpdate.title = payload.title;
      dataToUpdate.slug = await generateUniqueProductSlug(payload.title, product.id);
    }

    if (payload.description !== undefined) {
      dataToUpdate.description = payload.description;
    }
    if (payload.category !== undefined) {
      dataToUpdate.category = payload.category;
    }
    if (payload.subcategory !== undefined) {
      dataToUpdate.subcategory = payload.subcategory ?? null;
    }
    if (payload.productType !== undefined) {
      dataToUpdate.productType = payload.productType;
    }
    if (payload.price !== undefined) {
      dataToUpdate.price = payload.price;
    }
    if (payload.listPrice !== undefined) {
      dataToUpdate.listPrice = payload.listPrice ?? null;
    }
    if (payload.stock !== undefined) {
      dataToUpdate.stock = payload.stock;
    }
    if (payload.images !== undefined) {
      dataToUpdate.images = JSON.stringify(
        payload.images.filter((img) => !!img && img.trim().length > 0),
      );
    }
    if (payload.tags !== undefined) {
      dataToUpdate.tags = JSON.stringify(
        payload.tags.filter((tag) => !!tag && tag.trim().length > 0),
      );
    }
    if (payload.attributes !== undefined) {
      dataToUpdate.attributes = payload.attributes ?? {};
    }
    if (payload.isActive !== undefined) {
      dataToUpdate.isActive = payload.isActive;
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: dataToUpdate,
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

    return NextResponse.json({
      success: true,
      data: serializeProduct(updated),
    });
  } catch (error) {
    console.error("Seller product update error:", error);
    return NextResponse.json(
      { success: false, error: "Ürün güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } },
) {
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

    if (!sellerProfile && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.productId,
        ...(user.role === "ADMIN" ? {} : { sellerId: sellerProfile!.id }),
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        isActive: false,
        stock: 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seller product delete error:", error);
    return NextResponse.json(
      { success: false, error: "Ürün silinemedi." },
      { status: 500 },
    );
  }
}

async function generateUniqueProductSlug(title: string, productId: string) {
  const base = createSlug(title);
  let candidate = base;
  let i = 1;

  while (await prisma.product.findFirst({ where: { slug: candidate, NOT: { id: productId } } })) {
    candidate = `${base}-${++i}`;
  }

  return candidate;
}




