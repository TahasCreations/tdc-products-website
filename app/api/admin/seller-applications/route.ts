import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAdmin, AdminAuthError } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const sellerType = searchParams.get("sellerType");
    const query = searchParams.get("q")?.trim();
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");
    const limitParam = searchParams.get("limit");

    if (type && type !== "all" && type !== "seller") {
      return NextResponse.json({ success: true, data: [], meta: { total: 0 } });
    }

    const filters: Prisma.SellerApplicationWhereInput[] = [];

    if (status && status !== "all") {
      filters.push({ status });
    }

    if (sellerType && sellerType !== "all") {
      filters.push({ sellerType });
    }

    if (query) {
      filters.push({
        OR: [
          { storeName: { contains: query, mode: "insensitive" } },
          { contactName: { contains: query, mode: "insensitive" } },
          { contactEmail: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
          { taxId: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
          { user: { email: { contains: query, mode: "insensitive" } } },
        ],
      });
    }

    const createdAtFilter: Prisma.DateTimeFilter = {};

    if (dateFromParam) {
      const from = new Date(dateFromParam);
      if (!Number.isNaN(from.getTime())) {
        createdAtFilter.gte = from;
      }
    }

    if (dateToParam) {
      const to = new Date(dateToParam);
      if (!Number.isNaN(to.getTime())) {
        createdAtFilter.lte = to;
      }
    }

    if (Object.keys(createdAtFilter).length > 0) {
      filters.push({ createdAt: createdAtFilter });
    }

    const where =
      filters.length > 0
        ? {
            AND: filters,
          }
        : undefined;

    let take = 100;
    if (limitParam) {
      const parsed = Number.parseInt(limitParam, 10);
      if (!Number.isNaN(parsed)) {
        take = Math.min(Math.max(parsed, 1), 200);
      }
    }

    const [applications, total] = await prisma.$transaction([
      prisma.sellerApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              roles: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take,
      }),
      prisma.sellerApplication.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications.map((application) => ({
        id: application.id,
        status: application.status,
        statusReason: application.statusReason,
        sellerType: application.sellerType,
        storeName: application.storeName,
        storeSlug: application.storeSlug,
        description: application.description,
        storeCategory: application.storeCategory,
        businessYears: application.businessYears,
        contactName: application.contactName,
        contactEmail: application.contactEmail,
        phone: application.phone,
        whatsapp: application.whatsapp,
        address: application.address,
        city: application.city,
        district: application.district,
        postalCode: application.postalCode,
        taxId: application.taxId,
        taxOffice: application.taxOffice,
        iban: application.iban,
        bankName: application.bankName,
        shippingPref: application.shippingPref,
        cargoCompanies: application.cargoCompanies
          ? JSON.parse(application.cargoCompanies)
          : [],
        preparationTime: application.preparationTime,
        returnPolicy: application.returnPolicy,
        returnAddress: application.returnAddress,
        agreements: application.agreements,
        metadata: application.metadata,
        createdAt: application.createdAt,
        processedAt: application.processedAt,
        processedBy: application.processedBy,
        user: application.user,
      })),
      meta: {
        total,
        limit: take,
      },
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.code === "UNAUTHORIZED" ? 401 : 403 },
      );
    }

    console.error("Seller applications fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Başvurular alınırken bir hata oluştu." },
      { status: 500 },
    );
  }
}


