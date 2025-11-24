import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getSellerDashboardData } from "@/lib/seller-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const data = await getSellerDashboardData(user.id);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error?.message === "SELLER_PROFILE_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    console.error("Seller dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Dashboard verileri yüklenemedi." },
      { status: 500 },
    );
  }
}




