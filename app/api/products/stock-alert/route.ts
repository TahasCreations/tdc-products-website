import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Stock Alert Subscription
 * Notify users when product is back in stock
 */

// Temporary storage (in production, use database table)
const stockAlerts: Map<string, Set<string>> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, email } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: 'Product ID and email required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        stock: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add to alerts
    if (!stockAlerts.has(productId)) {
      stockAlerts.set(productId, new Set());
    }
    stockAlerts.get(productId)!.add(email);

    // In production: Save to database
    // await prisma.stockAlert.create({
    //   data: { productId, email, isActive: true }
    // });

    // Send confirmation email (TODO)
    // await sendEmail({
    //   to: email,
    //   subject: 'Stok Bildirimi Aktif',
    //   html: `${product.title} stokta olduğunda size haber vereceğiz!`
    // });

    return NextResponse.json({
      success: true,
      message: 'Stock alert created successfully'
    });

  } catch (error) {
    console.error('Stock alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Webhook for when stock is updated (called from inventory management)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, newStock } = body;

    if (newStock > 0 && stockAlerts.has(productId)) {
      const emails = Array.from(stockAlerts.get(productId)!);
      
      // Send emails to subscribers
      // await Promise.all(emails.map(email => 
      //   sendEmail({
      //     to: email,
      //     subject: 'Ürün Stokta! 🎉',
      //     html: 'Beklediğiniz ürün tekrar stokta!'
      //   })
      // ));

      // Clear alerts for this product
      stockAlerts.delete(productId);

      return NextResponse.json({
        success: true,
        notified: emails.length
      });
    }

    return NextResponse.json({
      success: true,
      notified: 0
    });

  } catch (error) {
    console.error('Stock alert notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to notify' },
      { status: 500 }
    );
  }
}

