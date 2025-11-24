export const runtime = "nodejs";

export async function POST() {
  return new Response(
    JSON.stringify({
      success: false,
      error: "Bu uç nokta devre dışı bırakıldı. Lütfen /api/admin/influencer-applications kullanın.",
    }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" },
    },
  );
}
