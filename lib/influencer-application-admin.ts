import { prisma } from "@/lib/prisma";
import { sendInfluencerApplicationApproved, sendInfluencerApplicationRejected } from "@/src/lib/email";

interface ProcessResult {
  status: "success" | "skipped" | "error";
  message: string;
  httpStatus?: number;
}

function mergeRoles(currentRole: string, rolesJson: string | null): string[] {
  const roles = new Set<string>();
  if (currentRole) {
    roles.add(currentRole);
  }
  if (rolesJson) {
    try {
      const parsed = JSON.parse(rolesJson) as string[];
      parsed.forEach((role) => roles.add(role));
    } catch {
      roles.add(currentRole);
    }
  }
  return Array.from(roles);
}

export async function approveInfluencerApplication(
  applicationId: string,
  processedBy: string,
): Promise<ProcessResult> {
  const application = await prisma.influencerApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return {
      status: "error",
      message: "Başvuru bulunamadı.",
      httpStatus: 404,
    };
  }

  if (application.status === "approved") {
    return {
      status: "skipped",
      message: "Başvuru zaten onaylanmış.",
      httpStatus: 200,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: application.userId },
  });

  if (!user) {
    return {
      status: "error",
      message: "Başvuru sahibine ait kullanıcı kaydı bulunamadı.",
      httpStatus: 404,
    };
  }

  const existingProfile = await prisma.influencerProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    return {
      status: "error",
      message: "Bu kullanıcıya ait influencer profili zaten mevcut.",
      httpStatus: 409,
    };
  }

  const roles = mergeRoles(user.role, user.roles);
  if (!roles.includes("INFLUENCER")) {
    roles.push("INFLUENCER");
  }

  const primaryRole = user.role === "ADMIN" ? "ADMIN" : "INFLUENCER";

  const profileData = (application.profile ?? {}) as Record<string, unknown>;
  const preferences = (application.preferences ?? {}) as Record<string, unknown>;
  const performance = (application.performance ?? {}) as Record<string, unknown>;
  const socialLinks = (application.socialLinks ?? {}) as Record<string, unknown>;

  const displayName =
    (typeof profileData.fullName === "string" && profileData.fullName.trim()) ||
    user.name ||
    `Influencer_${user.id.slice(-6)}`;

  const platformsPayload = {
    primaryPlatform: application.primaryPlatform ?? performance.primaryPlatform ?? null,
    postingFrequency: application.postingFrequency ?? performance.postingFrequency ?? null,
    category: application.category ?? preferences.category ?? null,
  };

  const computedEngagement =
    application.followerEst && application.followerEst > 0 && application.avgLikes
      ? Number((application.avgLikes / application.followerEst).toFixed(4))
      : null;

  await prisma.$transaction([
    prisma.influencerApplication.update({
      where: { id: application.id },
      data: {
        status: "approved",
        statusReason: null,
        processedAt: new Date(),
        processedBy,
      },
    }),
    prisma.influencerProfile.create({
      data: {
        userId: user.id,
        displayName,
        bio: typeof application.notes === "string" ? application.notes : null,
        platforms: JSON.stringify(platformsPayload),
        profileLinks: JSON.stringify(socialLinks),
        followers: application.followerEst ?? null,
        engagement: computedEngagement,
        status: "APPROVED",
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        role: primaryRole,
        roles: JSON.stringify(roles),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Send approval email
  if (user.email) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      await sendInfluencerApplicationApproved(user.email, {
        influencerName: displayName,
        dashboardUrl: `${baseUrl}/influencer/dashboard`,
      });
    } catch (emailError) {
      console.error("Failed to send influencer approval email:", emailError);
      // Don't fail the transaction if email fails
    }
  }

  return {
    status: "success",
    message: "Başvuru onaylandı ve influencer profili oluşturuldu.",
    httpStatus: 200,
  };
}

export async function rejectInfluencerApplication(
  applicationId: string,
  processedBy: string,
  reason?: string | null,
): Promise<ProcessResult> {
  const application = await prisma.influencerApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return {
      status: "error",
      message: "Başvuru bulunamadı.",
      httpStatus: 404,
    };
  }

  if (application.status === "rejected") {
    return {
      status: "skipped",
      message: "Başvuru zaten reddedilmiş.",
      httpStatus: 200,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: application.userId },
  });

  await prisma.influencerApplication.update({
    where: { id: applicationId },
    data: {
      status: "rejected",
      statusReason: reason?.toString().slice(0, 500) ?? null,
      processedAt: new Date(),
      processedBy,
    },
  });

  // Send rejection email
  if (user?.email) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      await sendInfluencerApplicationRejected(user.email, {
        influencerName: user.name || "Değerli Başvuru Sahibi",
        reason: reason?.toString().slice(0, 500),
        contactUrl: `${baseUrl}/iletisim`,
      });
    } catch (emailError) {
      console.error("Failed to send influencer rejection email:", emailError);
      // Don't fail the transaction if email fails
    }
  }

  return {
    status: "success",
    message: "Başvuru reddedildi.",
    httpStatus: 200,
  };
}



