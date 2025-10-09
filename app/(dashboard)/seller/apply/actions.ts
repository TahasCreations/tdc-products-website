// /app/(dashboard)/seller/apply/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ApplySchema = z.object({
  // Mağaza Bilgileri
  storeName: z.string().min(3, "Mağaza adı en az 3 karakter olmalı"),
  storeSlug: z.string().min(3, "URL en az 3 karakter olmalı").regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire"),
  description: z.string().min(100, "Açıklama en az 100 karakter olmalı"),
  storeCategory: z.string().min(1, "Kategori seçmelisiniz"),
  businessYears: z.string().transform(Number),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  website: z.string().url("Geçerli bir URL girin").optional().or(z.literal('')),
  
  // İletişim Bilgileri
  contactName: z.string().min(2, "Yetkili adı gerekli"),
  contactTitle: z.string().min(2, "Ünvan gerekli"),
  contactEmail: z.string().email("Geçerli bir e-posta adresi girin"),
  alternativeEmail: z.string().email("Geçerli bir e-posta adresi girin").optional().or(z.literal('')),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  whatsapp: z.string().min(10, "WhatsApp numarası gerekli"),
  address: z.string().min(10, "Adres en az 10 karakter olmalı"),
  city: z.string().min(2, "İl bilgisi gerekli"),
  district: z.string().min(2, "İlçe bilgisi gerekli"),
  postalCode: z.string().min(5, "Posta kodu gerekli"),
  
  // Kimlik & Vergi
  sellerType: z.enum(["individual", "company"]),
  companyName: z.string().optional(),
  mersisNo: z.string().optional(),
  taxId: z.string().min(10, "TC Kimlik No veya Vergi No gerekli"),
  taxOffice: z.string().min(2, "Vergi dairesi gerekli"),
  iban: z.string().regex(/^TR[0-9]{24}$/, "Geçerli bir TR IBAN girin (boşluksuz)"),
  bankName: z.string().min(2, "Banka adı gerekli"),
  idFrontUrl: z.string().optional(),
  idBackUrl: z.string().optional(),
  
  // Lojistik & Operasyon
  cargoCompanies: z.string().optional(), // Will be array but comes as string from FormData
  warehouseAddress: z.string().optional(),
  returnAddress: z.string().min(10, "İade adresi gerekli"),
  preparationTime: z.string().min(1, "Hazırlık süresi seçmelisiniz"),
  estimatedStock: z.string().min(1, "Tahmini ürün adedi seçmelisiniz"),
  returnPolicy: z.enum(["14-days", "30-days", "no-return"]),
});

export async function applySeller(prev: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Giriş yapmanız gerekiyor" };

  // Check if user already has a seller profile
  try {
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (existingProfile) {
      return { ok: false, error: "Zaten bir satıcı başvurunuz mevcut. Lütfen onay bekleyin." };
    }
  } catch (error) {
    console.error("Error checking existing profile:", error);
  }

  const data = ApplySchema.safeParse({
    storeName: formData.get("storeName"),
    storeSlug: formData.get("storeSlug"),
    description: formData.get("description"),
    storeCategory: formData.get("storeCategory"),
    businessYears: formData.get("businessYears"),
    logoUrl: formData.get("logoUrl") || undefined,
    bannerUrl: formData.get("bannerUrl") || undefined,
    website: formData.get("website") || '',
    contactName: formData.get("contactName"),
    contactTitle: formData.get("contactTitle"),
    contactEmail: formData.get("contactEmail"),
    alternativeEmail: formData.get("alternativeEmail") || '',
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    city: formData.get("city"),
    district: formData.get("district"),
    postalCode: formData.get("postalCode"),
    sellerType: formData.get("sellerType"),
    companyName: formData.get("companyName") || undefined,
    mersisNo: formData.get("mersisNo") || undefined,
    taxId: formData.get("taxId"),
    taxOffice: formData.get("taxOffice"),
    iban: formData.get("iban"),
    bankName: formData.get("bankName"),
    idFrontUrl: formData.get("idFrontUrl") || undefined,
    idBackUrl: formData.get("idBackUrl") || undefined,
    cargoCompanies: formData.getAll("cargoCompanies").join(',') || undefined,
    warehouseAddress: formData.get("warehouseAddress") || undefined,
    returnAddress: formData.get("returnAddress"),
    preparationTime: formData.get("preparationTime"),
    estimatedStock: formData.get("estimatedStock"),
    returnPolicy: formData.get("returnPolicy"),
  });
  
  if (!data.success) {
    const errors = data.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(' | ');
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
        // Additional fields stored as metadata or in separate fields
      } as any,
    });

    // TODO: Store additional data in a metadata table or JSON field
    // For now, the core fields are stored in sellerProfile

    return { ok: true };
  } catch (error: any) {
    console.error("Seller application error:", error);
    if (error.code === 'P2002') {
      return { ok: false, error: "Bu mağaza adı veya URL zaten kullanılıyor" };
    }
    return { ok: false, error: "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin." };
  }
}
