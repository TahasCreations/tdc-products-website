import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Default canned responses
const DEFAULT_RESPONSES = [
  {
    title: 'Hoş Geldin Mesajı',
    shortcut: '/greeting',
    content: 'Merhaba! TDC Market\'e hoş geldiniz. Size nasıl yardımcı olabilirim?',
    category: 'greeting'
  },
  {
    title: 'Sipariş Durumu',
    shortcut: '/order-status',
    content: 'Sipariş durumunuzu kontrol etmek için sipariş numaranızı paylaşır mısınız? /orders sayfasından da takip edebilirsiniz.',
    category: 'order'
  },
  {
    title: 'İade Politikası',
    shortcut: '/refund',
    content: '14 gün içinde koşulsuz iade hakkınız vardır. İade işlemi için lütfen sipariş numaranızı ve iade sebebinizi belirtiniz.',
    category: 'order'
  },
  {
    title: 'Ödeme Sorunları',
    shortcut: '/payment',
    content: 'Ödeme ile ilgili sorunları çözmek için lütfen kullandığınız ödeme yöntemini ve hata mesajını belirtiniz.',
    category: 'payment'
  },
  {
    title: 'Kargo Süresi',
    shortcut: '/shipping',
    content: 'Siparişleriniz genellikle 2-3 iş günü içinde kargoya verilir. Kargo takip numaranız ile takip edebilirsiniz.',
    category: 'order'
  },
  {
    title: 'İnsan Desteği',
    shortcut: '/human',
    content: 'Bir temsilcimize bağlanıyorum. Lütfen birkaç dakika bekleyiniz...',
    category: 'technical'
  }
];

// GET - Get all canned responses
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let responses = await prisma.cannedResponse.findMany({
      where: category ? { category, isActive: true } : { isActive: true },
      orderBy: {
        usageCount: 'desc'
      }
    });

    // If no responses exist, seed defaults
    if (responses.length === 0) {
      await prisma.cannedResponse.createMany({
        data: DEFAULT_RESPONSES
      });
      
      responses = await prisma.cannedResponse.findMany({
        where: { isActive: true }
      });
    }

    return NextResponse.json({
      success: true,
      responses
    });

  } catch (error) {
    console.error('Canned responses fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch responses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create canned response (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, shortcut, content, category } = body;

    const response = await prisma.cannedResponse.create({
      data: {
        title,
        shortcut,
        content,
        category,
        createdBy: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      response
    });

  } catch (error) {
    console.error('Canned response creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create response' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

