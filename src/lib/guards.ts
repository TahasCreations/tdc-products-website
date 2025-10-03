// /lib/guards.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Plan → entitlement haritası
const PLAN_ENTITLEMENTS: Record<string, string[]> = {
  FREE:    [],
  STARTER: ["analytics-lite"],
  GROWTH:  ["analytics-lite","keyword-tool"],
  PRO:     ["analytics-lite","keyword-tool","bulk-upload"],
};

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/giris");
  }
  return session.user;
}

export async function requireRole(...roles: Array<"BUYER" | "SELLER" | "ADMIN">) {
  const user = await requireUser();
  if (!roles.includes((user.role as any) ?? "BUYER")) {
    redirect("/403");
  }
  return user;
}

export async function requireAdmin() {
  return await requireRole("ADMIN");
}

export async function requireSeller() {
  return await requireRole("SELLER", "ADMIN");
}

export async function requireBuyer() {
  return await requireRole("BUYER", "SELLER", "ADMIN");
}

// Optional: Session var mı kontrol et (redirect etmeden)
export async function getOptionalUser() {
  const session = await auth();
  return session?.user || null;
}

// Optional: Belirli rol var mı kontrol et
export async function hasRole(...roles: Array<"BUYER" | "SELLER" | "ADMIN">) {
  const user = await getOptionalUser();
  if (!user) return false;
  return roles.includes((user.role as any) ?? "BUYER");
}

// Optional: Admin mi kontrol et
export async function isAdmin() {
  return await hasRole("ADMIN");
}

// Optional: Seller mi kontrol et
export async function isSeller() {
  return await hasRole("SELLER", "ADMIN");
}

// Satıcı sadece kendi verilerine erişebilir
export async function requireSellerOwnership(sellerId: string) {
  const user = await requireSeller();
  
  // Admin her şeye erişebilir
  if (user.role === "ADMIN") {
    return user;
  }
  
  // Seller sadece kendi verilerine erişebilir
  if (user.role === "SELLER") {
    // SellerProfile'dan sellerId'yi kontrol et
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });
    
    if (!sellerProfile || sellerProfile.id !== sellerId) {
      throw new Error("forbidden");
    }
  }
  
  return user;
}

// Influencer functions
export async function requireInfluencerApproved() {
  const { user } = await auth();
  if (!user) throw new Error("auth_required");
  const inf = await prisma.influencerProfile.findUnique({ where: { userId: (user as any).id } });
  if (!inf || inf.status !== "APPROVED") throw new Error("forbidden");
  return { user, inf };
}

export async function isInfluencerApproved(userId: string) {
  const inf = await prisma.influencerProfile.findUnique({ where: { userId } });
  return !!inf && inf.status === "APPROVED";
}

export async function requireInfluencer(userId?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("auth_required");
  const uid = userId || (session.user as any).id;
  const prisma = new PrismaClient();
  const prof = await prisma.influencerProfile.findUnique({ where: { userId: uid } });
  if (!prof || prof.status !== "APPROVED") throw new Error("forbidden");
  return { userId: uid, profileId: prof.id };
}

export function platformFee(amount: number) { 
  return Number((amount * 0.10).toFixed(2)); 
}

export function influencerTake(amount: number) { 
  return Number((amount * 0.90).toFixed(2)); 
}

// Abonelik planı al
export async function getActivePlanForUser(userId: string): Promise<"FREE" | "STARTER" | "GROWTH" | "PRO"> {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      subscriptions: {
        where: {
          status: "active",
          periodEnd: { gte: new Date() }
        },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!sellerProfile || sellerProfile.subscriptions.length === 0) {
    return "FREE";
  }

  return sellerProfile.subscriptions[0].plan as "FREE" | "STARTER" | "GROWTH" | "PRO";
}

// Entitlement kontrolü
export async function requireEntitlement(entitlement: string) {
  const user = await requireUser();
  
  // ADMIN her şeye erişebilir
  if (user.role === "ADMIN") {
    return user;
  }

  // SELLER için plan kontrolü
  if (user.role === "SELLER") {
    const plan = await getActivePlanForUser(user.id as string);
    const allowedEntitlements = PLAN_ENTITLEMENTS[plan];
    
    if (!allowedEntitlements.includes(entitlement as any)) {
      redirect("/403");
    }
  }

  return user;
}

// Export auth function for compatibility
export { auth } from '@/lib/auth';