import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function resolveTenant() {
  const h = headers();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").toLowerCase();
  // admin/ana domain: tdcmarket.com veya vercel.app domain'in
  const ROOTS = ["tdcmarket.com", "tdc-products-website.vercel.app"]; // GEREKİRSE düzenle
  const isRoot = ROOTS.some(r => host === r || host.endsWith("."+r));
  if (isRoot) return null;

  // özel alan adı eşlemesi
  const domain = await prisma.storeDomain.findUnique({
    where: { hostname: host }, 
    include: { seller: true }
  });
  if (!domain || domain.status !== "ACTIVE") return null;

  const theme = await prisma.storeTheme.findUnique({ 
    where: { sellerId: domain.sellerId } 
  });
  return { sellerId: domain.sellerId, domain, theme };
}
