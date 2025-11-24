import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, AdminAuthError } from "@/lib/admin-auth";
import { rejectInfluencerApplication } from "@/lib/influencer-application-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { applicationId: string } },
) {
  try {
    const admin = await requireAdmin(request);

    const { applicationId } = params;
    const { reason } = await request.json().catch(() => ({ reason: "" }));

    const processedBy = admin.email ?? admin.userId ?? "system";
    const result = await rejectInfluencerApplication(applicationId, processedBy, reason);

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

    console.error("Influencer application reject error:", error);
    return NextResponse.json(
      { success: false, error: "Başvuru reddedilirken bir hata oluştu." },
      { status: 500 },
    );
  }
}




