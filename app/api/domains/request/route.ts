export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { requireRole } from "@/lib/guards";
export async function POST(req: NextRequest) {
  const user = await requireRole("SELLER","ADMIN");
  const { hostname } = await req.json();
  if (!hostname) return new Response("bad_request",{status:400});
  
  // sellerId
  const sp = await prisma.sellerProfile.findUnique({ 
    where:{ userId: (user as any).id }, 
    select:{ id:true }
  });
  if (!sp) return new Response("seller_profile_required",{status:400});

  // Domain hakkı kontrolü
  const allowance = await prisma.domainAllowance.findFirst({
    where: { sellerId: sp.id, consumed: false },
    orderBy: { createdAt: "asc" },
  });

  const dnsTarget = "tdc-products-website.vercel.app"; // ENV ile de alabiliriz
  
  if (allowance) {
    // Domain hakkı var, consume et
    await prisma.domainAllowance.update({
      where: { id: allowance.id },
      data: { consumed: true, consumedAt: new Date() }
    });
    
    // ledger'e not düş (amortizasyonu cron ile aylık dağıtmak istersen ileride kullanırız)
    await prisma.ledgerEntry.create({
      data: {
        sellerId: sp.id,
        type: "ADJUSTMENT",
        amount: 0, // domain bedeli "paket içinde" kabul ediliyor
        currency: "TRY",
        meta: { kind: "DOMAIN_INCLUDED", years: allowance.years }
      }
    });
  }

  const d = await prisma.storeDomain.create({
    data: { 
      sellerId: sp.id, 
      hostname: hostname.toLowerCase(), 
      dnsTarget, 
      status: "PENDING" 
    }
  });
  
  return Response.json({ 
    ok: true, 
    domain: d,
    hasAllowance: !!allowance,
    message: allowance ? "Domain hakkınız kullanıldı" : "Domain talebi oluşturuldu, admin onayı bekleniyor"
  });
}
