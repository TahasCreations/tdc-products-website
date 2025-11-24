import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBankAccountSchema = z.object({
  bankName: z.string().min(1).optional(),
  accountName: z.string().min(1).optional(),
  iban: z.string().min(1).optional(),
  accountNumber: z.string().optional(),
  branchCode: z.string().optional(),
  branchName: z.string().optional(),
  currency: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  displayOrder: z.number().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateBankAccountSchema.parse(body);

    // Eğer default olarak işaretleniyorsa, diğerlerini default'tan çıkar
    if (validatedData.isDefault) {
      await prisma.bankAccount.updateMany({
        where: {
          isDefault: true,
          id: { not: params.id },
        },
        data: { isDefault: false },
      });
    }

    const bankAccount = await prisma.bankAccount.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      bankAccount,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Banka hesabı güncelleme hatası:', error);
    return NextResponse.json(
      {
        error: "Banka hesabı güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    await prisma.bankAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Banka hesabı silindi",
    });

  } catch (error) {
    console.error('Banka hesabı silme hatası:', error);
    return NextResponse.json(
      {
        error: "Banka hesabı silinemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



