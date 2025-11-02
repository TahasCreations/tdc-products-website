import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ role: "BUYER" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        image: true 
      },
    });

    return NextResponse.json(user || { role: "BUYER" });
  } catch (error) {
    console.error("User info error:", error);
    return NextResponse.json({ role: "BUYER" });
  } finally {
    }
}
