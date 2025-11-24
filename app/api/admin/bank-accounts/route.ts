import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBankAccountSchema = z.object({
  bankName: z.string().min(1),
  accountName: z.string().min(1),
  iban: z.string().min(1),
  accountNumber: z.string().optional(),
  branchCode: z.string().optional(),
  branchName: z.string().optional(),
  currency: z.string().default("TRY"),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  displayOrder: z.number().default(0),
  notes: z.string().optional(),
});

const updateBankAccountSchema = createBankAccountSchema.partial();

export async function GET(req: Request) {
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

    const bankAccounts = await prisma.bankAccount.findMany({
      orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      bankAccounts,
    });

  } catch (error) {
    console.error('Banka hesapları listeleme hatası:', error);
    return NextResponse.json(
      {
        error: "Banka hesapları listelenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    const validatedData = createBankAccountSchema.parse(body);

    // Eğer default olarak işaretleniyorsa, diğerlerini default'tan çıkar
    if (validatedData.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const bankAccount = await prisma.bankAccount.create({
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

    console.error('Banka hesabı oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Banka hesabı oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



