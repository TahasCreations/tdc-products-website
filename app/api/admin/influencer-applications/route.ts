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
    const platform = searchParams.get("platform");
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.trim();
    const limitParam = searchParams.get("limit");

    const filters: Prisma.InfluencerApplicationWhereInput[] = [];

    if (status && status !== "all") {
      filters.push({ status });
    }

    if (platform && platform !== "all") {
      filters.push({ primaryPlatform: platform });
    }

    if (category && category !== "all") {
      filters.push({ category });
    }

    if (query) {
      filters.push({
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
          { notes: { contains: query, mode: "insensitive" } },
          { portfolio: { contains: query, mode: "insensitive" } },
          { pastCollaborations: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    const where =
      filters.length > 0
        ? ({
            AND: filters,
          } as Prisma.InfluencerApplicationWhereInput)
        : undefined;

    let take = 100;
    if (limitParam) {
      const parsed = Number.parseInt(limitParam, 10);
      if (!Number.isNaN(parsed)) {
        take = Math.min(Math.max(parsed, 1), 200);
      }
    }

    const [applications, total] = await prisma.$transaction([
      prisma.influencerApplication.findMany({
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
      prisma.influencerApplication.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications.map((application) => ({
        id: application.id,
        status: application.status,
        statusReason: application.statusReason,
        category: application.category,
        primaryPlatform: application.primaryPlatform,
        postingFrequency: application.postingFrequency,
        followerEst: application.followerEst,
        avgViews: application.avgViews,
        avgLikes: application.avgLikes,
        collaborationTypes: Array.isArray(application.collaborationTypes)
          ? application.collaborationTypes
          : [],
        profile: application.profile,
        socialLinks: application.socialLinks,
        audience: application.audience,
        performance: application.performance,
        preferences: application.preferences,
        portfolio: application.portfolio,
        pastCollaborations: application.pastCollaborations,
        notes: application.notes,
        consents: application.consents,
        agreement: application.agreement,
        communicationConsent: application.communicationConsent,
        dataProcessingConsent: application.dataProcessingConsent,
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

    console.error("Influencer applications fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Başvurular alınırken bir hata oluştu." },
      { status: 500 },
    );
  }
}




