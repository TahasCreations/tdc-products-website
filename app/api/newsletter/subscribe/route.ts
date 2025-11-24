import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Newsletter Subscription API
 * Used by Exit Intent Popup and Footer
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In production: Save to database
    // For now, we'll just log it
    console.log('📧 Newsletter subscription:', email);

    // Generate discount coupon
    const couponCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // TODO: Send email with coupon
    // await sendEmail({
    //   to: email,
    //   subject: 'Hoş Geldiniz! %10 İndirim Kuponunuz',
    //   html: `Kupon Kodunuz: ${couponCode}`
    // });

    // Save to newsletter subscribers
    try {
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (!existing) {
        await prisma.newsletterSubscriber.create({
          data: {
            email,
            source: 'website',
            status: 'active',
          },
        });
      } else if (existing.status !== 'active') {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            status: 'active',
            unsubscribedAt: null,
          },
        });
      }
    } catch (dbError) {
      console.error('Newsletter subscription save error:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      couponCode
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

