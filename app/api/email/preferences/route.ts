import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const preferencesSchema = z.object({
  orderUpdates: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  priceDropAlerts: z.boolean().optional(),
  reviewReminders: z.boolean().optional(),
  weeklyNewsletter: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        emailPreferences: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default preferences if not set
    const defaultPreferences = {
      orderUpdates: true,
      marketingEmails: false,
      priceDropAlerts: true,
      reviewReminders: true,
      weeklyNewsletter: false,
    };

    const preferences = user.emailPreferences ? 
      { ...defaultPreferences, ...user.emailPreferences } : 
      defaultPreferences;

    return NextResponse.json(preferences);

  } catch (error) {
    console.error('Email preferences getirilirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = preferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, emailPreferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentPreferences = user.emailPreferences || {};
    const updatedPreferences = { ...currentPreferences, ...validatedData };

    await prisma.user.update({
      where: { id: user.id },
      data: { emailPreferences: updatedPreferences }
    });

    return NextResponse.json({ 
      success: true, 
      preferences: updatedPreferences 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Email preferences güncellenirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
