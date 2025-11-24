import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EFaturaAdapter } from "@/lib/invoice/efatura-adapter";

export async function GET(
  req: Request,
  { params }: { params: { invoiceNumber: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fatura PDF'ini oluştur
    const adapter = new EFaturaAdapter();
    const pdfResult = await adapter.generatePDF(params.invoiceNumber);

    // PDF URL'ini döndür (gerçek implementasyonda PDF dosyası döndürülebilir)
    return NextResponse.json({
      success: true,
      pdfUrl: pdfResult.pdfUrl,
      expiresAt: pdfResult.expiresAt,
    });

  } catch (error) {
    console.error('Fatura PDF oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Fatura PDF oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



