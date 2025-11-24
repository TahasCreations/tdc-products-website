import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const rawProfile = typeof body?.profile === "object" && body.profile !== null ? body.profile : {};
    const rawSocialLinks =
      typeof body?.socialLinks === "object" && body.socialLinks !== null ? body.socialLinks : {};
    const rawAudience =
      typeof body?.audience === "object" && body.audience !== null ? body.audience : {};
    const rawPerformance =
      typeof body?.performance === "object" && body.performance !== null ? body.performance : {};
    const rawPreferences =
      typeof body?.preferences === "object" && body.preferences !== null ? body.preferences : {};
    const rawConsents =
      typeof body?.consents === "object" && body.consents !== null ? body.consents : {};

    const profile = rawProfile;
    const socialLinks = Object.fromEntries(
      Object.entries(rawSocialLinks).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() || undefined : value,
      ]),
    );
    const audience = rawAudience;
    const performance = rawPerformance;
    const preferences = rawPreferences;
    const consents = rawConsents;
    const portfolio =
      typeof body?.portfolio === "string" && body.portfolio.trim().length > 0
        ? body.portfolio.trim()
        : null;
    const pastCollaborations =
      typeof body?.pastCollaborations === "string" && body.pastCollaborations.trim().length > 0
        ? body.pastCollaborations.trim()
        : null;
    const notes =
      typeof body?.notes === "string" && body.notes.trim().length > 0 ? body.notes.trim() : null;

    const hasAnySocialLink = Object.values(socialLinks).some(
      (value) => typeof value === "string" && value.trim().length > 0,
    );

    if (!hasAnySocialLink || !consents?.agreement) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const existingApp = await prisma.influencerApplication.findFirst({
      where: { userId: user.id, status: { in: ["pending", "approved"] } },
    });

    if (existingApp) {
      return NextResponse.json(
        {
          error: "Zaten aktif bir başvurunuz bulunmaktadır",
        },
        { status: 400 },
      );
    }

    const followerEst = audience?.followerEst;
    const avgViews = performance?.avgViews;
    const avgLikes = performance?.avgLikes;
    const primaryPlatform = performance?.primaryPlatform ?? preferences?.primaryPlatform ?? null;
    const postingFrequency = performance?.postingFrequency ?? null;
    const category = preferences?.category ?? null;
    const collaborationTypes = Array.isArray(preferences?.collaborationTypes)
      ? preferences.collaborationTypes.filter((item: unknown) => typeof item === "string" && item)
      : [];

    const app = await prisma.influencerApplication.create({
      data: {
        userId: user.id,
        profile,
        socialLinks,
        audience,
        performance,
        preferences,
        collaborationTypes,
        portfolio,
        pastCollaborations,
        notes,
        consents,
        followerEst:
          typeof followerEst === "number"
            ? followerEst
            : followerEst
            ? Number.parseInt(followerEst, 10) || null
            : null,
        avgViews:
          typeof avgViews === "number"
            ? avgViews
            : avgViews
            ? Number.parseInt(avgViews, 10) || null
            : null,
        avgLikes:
          typeof avgLikes === "number"
            ? avgLikes
            : avgLikes
            ? Number.parseInt(avgLikes, 10) || null
            : null,
        primaryPlatform: primaryPlatform ?? null,
        postingFrequency: postingFrequency ?? null,
        category,
        agreement: Boolean(consents?.agreement),
        communicationConsent: Boolean(consents?.communicationConsent),
        dataProcessingConsent: Boolean(consents?.dataProcessingConsent),
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, id: app.id });
  } catch (error) {
    console.error("Influencer application error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  } finally {
  }
}
