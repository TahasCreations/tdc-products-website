import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KVKKCompliance } from "@/lib/kvkk/compliance";
import { z } from "zod";

const deleteRequestSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({ message: "Silme işlemini onaylamanız gerekmektedir" }),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = deleteRequestSchema.parse(body);

    // Kullanıcıyı anonimleştir (unutulma hakkı)
    await KVKKCompliance.anonymizeUser(user.id);

    return NextResponse.json({
      success: true,
      message: "Hesabınız silindi ve verileriniz anonimleştirildi",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('KVKK veri silme hatası:', error);
    return NextResponse.json(
      {
        error: "Veri silinemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



