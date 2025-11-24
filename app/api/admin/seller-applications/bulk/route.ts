import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, AdminAuthError } from "@/lib/admin-auth";
import {
  approveSellerApplication,
  rejectSellerApplication,
} from "@/lib/seller-application-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BulkAction = "approve" | "reject";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

    const ids = Array.isArray(body?.ids) ? body.ids : [];
    const action: BulkAction | undefined = body?.action;
    const reason: string | undefined = body?.reason;

    const sanitizedIds = Array.from(
      new Set(
        ids
          .map((id: unknown) => (typeof id === "string" ? id.trim() : ""))
          .filter((id: string) => id.length > 0),
      ),
    );

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { success: false, error: "Geçersiz aksiyon. 'approve' veya 'reject' kullanılmalı." },
        { status: 400 },
      );
    }

    if (sanitizedIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "İşlem yapılacak başvuru bulunamadı." },
        { status: 400 },
      );
    }

    const processedBy = admin.email ?? admin.userId ?? "system";

    const results = await Promise.all(
      sanitizedIds.map(async (id) => {
        try {
          const result =
            action === "approve"
              ? await approveSellerApplication(id, processedBy)
              : await rejectSellerApplication(id, processedBy, reason);

          return {
            id,
            status: result.status,
            message: result.message,
            httpStatus: result.httpStatus ?? 200,
          };
        } catch (error) {
          console.error(`Bulk ${action} error for application ${id}:`, error);
          return {
            id,
            status: "error" as const,
            message: "Başvuru işlenirken beklenmeyen bir hata oluştu.",
            httpStatus: 500,
          };
        }
      }),
    );

    const summary = results.reduce(
      (acc, result) => {
        if (result.status === "success") {
          acc.successCount += 1;
        } else if (result.status === "skipped") {
          acc.skippedCount += 1;
        } else {
          acc.errorCount += 1;
        }
        return acc;
      },
      { successCount: 0, skippedCount: 0, errorCount: 0 },
    );

    const hasErrors = summary.errorCount > 0;
    const hasSuccess = summary.successCount > 0 || summary.skippedCount > 0;

    const status = hasErrors ? (hasSuccess ? 207 : 400) : 200;

    return NextResponse.json(
      {
        success: !hasErrors,
        action,
        summary,
        results,
      },
      { status },
    );
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.code === "UNAUTHORIZED" ? 401 : 403 },
      );
    }

    console.error("Bulk seller application action error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Başvurular işlenirken bir hata oluştu.",
      },
      { status: 500 },
    );
  }
}




