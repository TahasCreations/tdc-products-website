import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function POST(
  req: NextRequest,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domainId } = params;

    // Get domain and verify ownership
    const domain = await prisma.storeDomain.findUnique({
      where: { id: domainId },
      include: {
        seller: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!domain || domain.seller.userId !== session.user.id) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // TODO: Implement actual DNS verification
    // For now, we'll simulate verification
    const isVerified = Math.random() > 0.5; // Simulate 50% success rate

    if (isVerified) {
      const updatedDomain = await prisma.storeDomain.update({
        where: { id: domainId },
        data: {
          status: 'ACTIVE',
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        domain: updatedDomain,
      });
    } else {
      await prisma.storeDomain.update({
        where: { id: domainId },
        data: {
          status: 'VERIFYING',
        },
      });

      return NextResponse.json({
        success: false,
        message: 'DNS records not found. Please wait 24-48 hours for DNS propagation.',
      });
    }
  } catch (error) {
    console.error('Error verifying domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

