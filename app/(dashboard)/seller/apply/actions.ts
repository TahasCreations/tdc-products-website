// /app/(dashboard)/seller/apply/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ApplySchema = z.object({
  storeName: z.string().min(3),
  storeSlug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  taxNumber: z.string().optional(),
  iban: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function applySeller(prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "auth_required" };

  const data = ApplySchema.safeParse({
    storeName: formData.get("storeName"),
    storeSlug: formData.get("storeSlug"),
    taxNumber: formData.get("taxNumber"),
    iban: formData.get("iban"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
  });
  
  if (!data.success) return { ok: false, error: "invalid_data" };

  try {
    await prisma.sellerProfile.create({
      data: {
        userId: session.user.id,
        storeName: data.data.storeName,
        storeSlug: data.data.storeSlug,
        taxNumber: data.data.taxNumber,
        iban: data.data.iban,
        description: data.data.description,
        logoUrl: data.data.logoUrl,
        status: "pending",
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("Seller application error:", error);
    return { ok: false, error: "database_error" };
  }
}
