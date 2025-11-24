import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, AdminAuthError } from "@/lib/admin-auth";
import { approveInfluencerApplication } from "@/lib/influencer-application-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { applicationId: string } },
) {
  try {
    const admin = await requireAdmin(request);

    const { applicationId } = params;

    const processedBy = admin.email ?? admin.userId ?? "system";
    const result = await approveInfluencerApplication(applicationId, processedBy);

    if (result.status === "error") {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: result.httpStatus ?? 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: result.status,
        message: result.message,
      },
      { status: result.httpStatus ?? 200 },
    );
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.code === "UNAUTHORIZED" ? 401 : 403 },
      );
    }

    console.error("Influencer application approve error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Başvuru onaylanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 },
    );
  }
}




