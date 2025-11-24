import { prisma } from "@/lib/prisma";
import { sendSellerApplicationApproved, sendSellerApplicationRejected } from "@/src/lib/email";

interface ProcessResult {
  status: "success" | "skipped" | "error";
  message: string;
  httpStatus?: number;
}

function normalizeCargoCompanies(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item : String(item)))
        .filter(Boolean);
    }

    return [];
  } catch {
    return [];
  }
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

export async function approveSellerApplication(
  applicationId: string,
  processedBy: string,
): Promise<ProcessResult> {
  const application = await prisma.sellerApplication.findUnique({
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

  const existingProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    return {
      status: "error",
      message: "Bu kullanıcıya ait onaylanmış bir mağaza zaten mevcut.",
      httpStatus: 409,
    };
  }

  const existingSlug = await prisma.sellerProfile.findUnique({
    where: { storeSlug: application.storeSlug },
  });

  if (existingSlug) {
    return {
      status: "error",
      message: "Seçilen mağaza URL'si başka bir satıcı tarafından kullanılıyor.",
      httpStatus: 409,
    };
  }

  const roles = mergeRoles(user.role, user.roles);
  if (!roles.includes("SELLER")) {
    roles.push("SELLER");
  }

  const primaryRole = user.role === "ADMIN" ? "ADMIN" : "SELLER";

  await prisma.$transaction([
    prisma.sellerApplication.update({
      where: { id: application.id },
      data: {
        status: "approved",
        statusReason: null,
        processedAt: new Date(),
        processedBy,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        userId: user.id,
        storeName: application.storeName,
        storeSlug: application.storeSlug,
        description: application.description,
        taxNumber: application.taxId,
        iban: application.iban,
        status: "approved",
        logoUrl: null,
        policiesJson: {
          shippingPref: application.shippingPref,
          preparationTime: application.preparationTime,
          returnPolicy: application.returnPolicy,
          returnAddress: application.returnAddress,
          cargoCompanies: normalizeCargoCompanies(application.cargoCompanies),
        },
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
      await sendSellerApplicationApproved(user.email, {
        sellerName: user.name || "Değerli Satıcı",
        storeName: application.storeName,
        dashboardUrl: `${baseUrl}/seller/dashboard`,
      });
    } catch (emailError) {
      console.error("Failed to send seller approval email:", emailError);
      // Don't fail the transaction if email fails
    }
  }

  return {
    status: "success",
    message: "Başvuru onaylandı ve satıcı profili oluşturuldu.",
    httpStatus: 200,
  };
}

export async function rejectSellerApplication(
  applicationId: string,
  processedBy: string,
  reason?: string | null,
): Promise<ProcessResult> {
  const application = await prisma.sellerApplication.findUnique({
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

  await prisma.sellerApplication.update({
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
      await sendSellerApplicationRejected(user.email, {
        sellerName: user.name || "Değerli Başvuru Sahibi",
        reason: reason?.toString().slice(0, 500),
        contactUrl: `${baseUrl}/iletisim`,
      });
    } catch (emailError) {
      console.error("Failed to send seller rejection email:", emailError);
      // Don't fail the transaction if email fails
    }
  }

  return {
    status: "success",
    message: "Başvuru reddedildi.",
    httpStatus: 200,
  };
}


