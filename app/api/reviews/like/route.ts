import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const likeReviewSchema = z.object({
  reviewId: z.string().min(1),
  isLike: z.boolean(),
});

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

    const body = await req.json();
    const { reviewId, isLike } = likeReviewSchema.parse(body);

    // Değerlendirmenin var olup olmadığını kontrol et
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, isHelpful: true }
    });

    if (!review) {
      return NextResponse.json({ error: "Değerlendirme bulunamadı" }, { status: 404 });
    }

    // Kullanıcının daha önce like/dislike yapıp yapmadığını kontrol et
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: reviewId,
        }
      }
    });

    let helpfulCount = review.isHelpful;

    if (existingLike) {
      // Mevcut like'ı güncelle
      if (existingLike.isLike !== isLike) {
        await prisma.reviewLike.update({
          where: {
            userId_reviewId: {
              userId: user.id,
              reviewId: reviewId,
            }
          },
          data: { isLike }
        });

        // Yararlı sayısını güncelle
        helpfulCount = isLike ? helpfulCount + 1 : helpfulCount - 1;
      } else {
        // Aynı değer, like'ı kaldır
        await prisma.reviewLike.delete({
          where: {
            userId_reviewId: {
              userId: user.id,
              reviewId: reviewId,
            }
          }
        });

        // Yararlı sayısını güncelle
        helpfulCount = isLike ? helpfulCount - 1 : helpfulCount;
      }
    } else {
      // Yeni like oluştur
      await prisma.reviewLike.create({
        data: {
          userId: user.id,
          reviewId: reviewId,
          isLike
        }
      });

      // Yararlı sayısını güncelle
      helpfulCount = isLike ? helpfulCount + 1 : helpfulCount;
    }

    // Review'ın isHelpful sayısını güncelle
    await prisma.review.update({
      where: { id: reviewId },
      data: { isHelpful: helpfulCount }
    });

    return NextResponse.json({
      success: true,
      isHelpful: helpfulCount,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Review like işlemi sırasında hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
