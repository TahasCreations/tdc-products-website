// /app/(dashboard)/seller/apply/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ApplySchema = z.object({
  storeName: z.string().min(3, "Mağaza adı en az 3 karakter olmalı"),
  storeSlug: z.string().min(3, "URL en az 3 karakter olmalı").regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanın"),
  description: z.string().min(50, "Açıklama en az 50 karakter olmalı"),
  contactName: z.string().min(2, "Yetkili adı gerekli"),
  contactEmail: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  whatsapp: z.string().optional(),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
  city: z.string().min(2, "İl bilgisi gerekli"),
  postalCode: z.string().optional(),
  sellerType: z.enum(["individual", "company"]),
  taxId: z.string().min(10, "TC Kimlik No veya Vergi No gerekli"),
  taxOffice: z.string().optional(),
  iban: z.string().regex(/^TR[0-9]{24}$/, "Geçerli bir TR IBAN girin"),
  bankName: z.string().min(2, "Banka adı gerekli"),
  logoUrl: z.string().optional(),
});

export async function applySeller(prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "auth_required" };

  const data = ApplySchema.safeParse({
    storeName: formData.get("storeName"),
    storeSlug: formData.get("storeSlug"),
    description: formData.get("description"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp") || null,
    address: formData.get("address"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode") || null,
    sellerType: formData.get("sellerType"),
    taxId: formData.get("taxId"),
    taxOffice: formData.get("taxOffice") || null,
    iban: formData.get("iban"),
    bankName: formData.get("bankName"),
    logoUrl: formData.get("logoUrl") || null,
  });
  
  if (!data.success) {
    const errors = data.error.errors.map(e => e.message).join(', ');
    return { ok: false, error: errors };
  }

  try {
    // Check if slug is already taken
    const existingSlug = await prisma.sellerProfile.findUnique({
      where: { storeSlug: data.data.storeSlug }
    });

    if (existingSlug) {
      return { ok: false, error: "Bu mağaza URL'i zaten kullanılıyor. Lütfen farklı bir URL deneyin." };
    }

    // Create seller profile with all data
    await prisma.sellerProfile.create({
      data: {
        userId: session.user.id,
        storeName: data.data.storeName,
        storeSlug: data.data.storeSlug,
        description: data.data.description,
        taxNumber: data.data.taxId,
        iban: data.data.iban,
        logoUrl: data.data.logoUrl,
        status: "pending",
        // Store additional data in a JSON field or separate table if needed
        // For now, we'll use the available fields
      } as any,
    });

    return { ok: true };
  } catch (error: any) {
    console.error("Seller application error:", error);
    if (error.code === 'P2002') {
      return { ok: false, error: "Bu mağaza adı veya URL zaten kullanılıyor" };
    }
    return { ok: false, error: "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
