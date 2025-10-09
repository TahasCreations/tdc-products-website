import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testEmail } = await req.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: "Test email gerekli" }, { status: 400 });
    }

    // Test welcome email gönder
    await sendWelcomeEmail(testEmail, {
      customerName: "Test Kullanıcı",
      loginUrl: "https://tdcmarket.com/auth/signin",
    });

    return NextResponse.json({ 
      success: true, 
      message: `Test email ${testEmail} adresine gönderildi!` 
    });

  } catch (error) {
    console.error('Test email gönderilirken hata:', error);
    return NextResponse.json({ 
      error: "Email gönderilemedi", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
