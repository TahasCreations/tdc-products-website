// /app/(admin)/sellers/approve/actions.ts
"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function approveSeller(sellerId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("forbidden");

  try {
    const sp = await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status: "approved" },
      select: { userId: true },
    });

    await prisma.user.update({
      where: { id: sp.userId },
      data: { role: "SELLER" },
    });

    return { ok: true };
  } catch (error) {
    console.error("Seller approval error:", error);
    return { ok: false, error: "database_error" };
  }
}

export async function rejectSeller(sellerId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("forbidden");

  try {
    await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { status: "rejected" },
    });

    return { ok: true };
  } catch (error) {
    console.error("Seller rejection error:", error);
    return { ok: false, error: "database_error" };
  }
}
