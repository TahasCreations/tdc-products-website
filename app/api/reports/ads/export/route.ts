export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { generateCSV } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const user = await requireRole("SELLER", "ADMIN");
  
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  
  if (!startDate || !endDate) {
    return new Response("start and end dates required", { status: 400 });
  }
  
  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });
  
  // Ledger entries
  const entries = await prisma.ledgerEntry.findMany({
    where: {
      sellerId: seller.id,
      type: "AD_SPEND",
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  // CSV data
  const csvData = entries.map(entry => ({
    Tarih: entry.createdAt.toLocaleDateString('tr-TR'),
    Tutar: entry.amount.toString(),
    Para_Birimi: entry.currency,
    Kampanya_ID: entry.meta?.campaignId || '',
    Ürün_ID: entry.meta?.productId || ''
  }));
  
  const csv = generateCSV(csvData, 'ads-report');
  
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ads-report-${startDate}-${endDate}.csv"`
    }
  });
}
