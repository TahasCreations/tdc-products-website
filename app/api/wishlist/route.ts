import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            images: true,
            category: true,
            rating: true,
            reviewCount: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(wishlistItems.map(item => ({
      id: item.product.id,
      title: item.product.title,
      slug: item.product.slug,
      price: item.product.price,
      image: JSON.parse(item.product.images)[0] || '/placeholder-product.jpg',
      category: item.product.category,
      rating: item.product.rating,
      reviewCount: item.product.reviewCount,
      addedAt: item.createdAt.toISOString(),
    })));

  } catch (error) {
    console.error('Wishlist getirilirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 });
    }

    // Ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Zaten wishlist'te mi kontrol et
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        }
      }
    });

    if (existingItem) {
      return NextResponse.json({ error: "Ürün zaten favorilerde" }, { status: 400 });
    }

    // Wishlist'e ekle
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId,
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Wishlist eklenirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 });
    }

    // Wishlist'ten çıkar
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId: productId,
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Wishlist\'ten çıkarılırken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
