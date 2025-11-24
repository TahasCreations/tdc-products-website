import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Bu uç nokta devre dışı bırakıldı. Lütfen /api/admin/influencer-applications kullanın.",
    },
    { status: 410 },
  );
}
