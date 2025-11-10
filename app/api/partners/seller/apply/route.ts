import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REQUIRED_FIELDS = [
  "storeName",
  "storeSlug",
  "description",
  "storeCategory",
  "contactName",
  "phone",
  "address",
  "city",
  "district",
  "postalCode",
  "taxId",
  "taxOffice",
  "iban",
];

const BOOLEAN_AGREEMENTS = [
  "acceptTerms",
  "acceptCommission",
  "acceptKVKK",
  "acceptQuality",
] as const;

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Satıcı başvurusu yapabilmek için giriş yapmalısınız." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !body[field] || String(body[field]).trim().length === 0,
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Lütfen tüm zorunlu alanları doldurun.",
          missingFields,
        },
        { status: 400 },
      );
    }

    const sellerType =
      typeof body.sellerType === "string" && body.sellerType === "company"
        ? "company"
        : "individual";

    const storeSlug = normalizeSlug(String(body.storeSlug));

    if (!storeSlug || storeSlug.length < 3) {
      return NextResponse.json(
        { error: "Geçerli bir mağaza URL'si belirleyin." },
        { status: 400 },
      );
    }

    const cargoCompanies: string[] = Array.isArray(body.cargoCompanies)
      ? body.cargoCompanies.map((value: string) => String(value))
      : body.cargoCompanies
        ? [String(body.cargoCompanies)]
        : [];

    const agreements = BOOLEAN_AGREEMENTS.reduce(
      (acc, key) => ({
        ...acc,
        [key]: Boolean(body[key]),
      }),
      {} as Record<(typeof BOOLEAN_AGREEMENTS)[number], boolean>,
    );

    const hasAllAgreements = BOOLEAN_AGREEMENTS.every((key) => agreements[key]);

    if (!hasAllAgreements) {
      return NextResponse.json(
        {
          error:
            "Tüm sözleşme ve politika onaylarını kabul etmeden başvurunuz tamamlanamaz.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail =
      typeof body.contactEmail === "string"
        ? body.contactEmail.trim().toLowerCase()
        : session.user.email?.toLowerCase() ?? "";

    const formattedIBAN = String(body.iban)
      .replace(/\s+/g, "")
      .toUpperCase();

    if (!/^TR\d{24}$/.test(formattedIBAN)) {
      return NextResponse.json(
        {
          error: "IBAN formatı geçersiz. Lütfen TR ile başlayan 26 karakter girin.",
        },
        { status: 400 },
      );
    }

    const existingSeller = await prisma.sellerProfile.findFirst({
      where: {
        OR: [{ userId: session.user.id }, { storeSlug }],
      },
    });

    if (existingSeller) {
      return NextResponse.json(
        {
          error:
            "Bu kullanıcıya ait aktif bir mağaza zaten bulunuyor veya seçtiğiniz mağaza URL'si mevcut.",
        },
        { status: 409 },
      );
    }

    const existingApplication = await prisma.sellerApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (
      existingApplication &&
      existingApplication.status !== "pending" &&
      existingApplication.status !== "rejected"
    ) {
      return NextResponse.json(
        {
          error:
            "Başvurunuz zaten değerlendirilmiş. Detaylar için destek ekibiyle iletişime geçin.",
        },
        { status: 409 },
      );
    }

    const now = new Date();

    const applicationData = {
      userId: session.user.id,
      sellerType,
      storeName: String(body.storeName).trim(),
      storeSlug,
      description: String(body.description).trim(),
      storeCategory: String(body.storeCategory),
      businessYears: body.businessYears ? String(body.businessYears) : null,
      contactName: String(body.contactName),
      contactEmail: normalizedEmail,
      phone: String(body.phone),
      whatsapp: body.whatsapp ? String(body.whatsapp) : null,
      address: String(body.address),
      city: String(body.city),
      district: String(body.district),
      postalCode: String(body.postalCode),
      taxId: String(body.taxId),
      taxOffice: String(body.taxOffice),
      iban: formattedIBAN,
      bankName: String(body.bankName),
      shippingPref: cargoCompanies.length > 0 ? cargoCompanies.join(",") : null,
      cargoCompanies:
        cargoCompanies.length > 0 ? JSON.stringify(cargoCompanies) : null,
      preparationTime: body.preparationTime
        ? String(body.preparationTime)
        : null,
      returnPolicy: body.returnPolicy ? String(body.returnPolicy) : null,
      returnAddress: body.returnAddress ? String(body.returnAddress) : null,
      agreements,
      documents: body.documents ?? null,
      metadata: {
        submittedAt: now.toISOString(),
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for"),
      },
      agreement: hasAllAgreements,
      status: "pending",
      statusReason: null,
      processedBy: null,
      processedAt: null,
    };

    if (existingApplication) {
      await prisma.sellerApplication.update({
        where: { userId: session.user.id },
        data: applicationData,
      });
    } else {
      await prisma.sellerApplication.create({
        data: applicationData,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Başvurunuz başarıyla alındı. En geç 3 iş günü içinde sizinle iletişime geçeceğiz.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Seller application error:", error);
    return NextResponse.json(
      {
        error: "Başvuru kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 },
    );
  }
}
