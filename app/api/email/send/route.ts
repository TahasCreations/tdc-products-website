import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { queueEmail } from "@/lib/email";
import { z } from "zod";

const sendEmailSchema = z.object({
  type: z.enum(['order_confirmation', 'welcome', 'password_reset', 'review_reminder', 'price_drop']),
  to: z.string().email(),
  data: z.any(),
  delay: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user has permission to send emails (admin only)
    const body = await req.json();
    const validatedData = sendEmailSchema.parse(body);

    await queueEmail(
      validatedData.type,
      validatedData.data,
      validatedData.to,
      validatedData.delay
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: (error as any).errors }, { status: 400 });
    }
    
    console.error('Email gönderilirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
