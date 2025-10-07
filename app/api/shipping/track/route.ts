import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TrackingRequest {
  trackingNumber: string;
  carrier?: string;
}

interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
  statusCode: string;
}

interface TrackingResponse {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  isDelivered: boolean;
  deliveryDate?: string;
}

export async function POST(req: Request) {
  try {
    const body: TrackingRequest = await req.json();
    const { trackingNumber, carrier } = body;

    if (!trackingNumber) {
      return NextResponse.json({ error: "Takip numarası gerekli" }, { status: 400 });
    }

    // Siparişi bul
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { trackingNumber },
          { 
            shipments: {
              some: {
                trackingNumber
              }
            }
          }
        ]
      },
      include: {
        shipments: true,
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Kargo takip bilgilerini al (mock data - gerçek uygulamada kargo firması API'sinden gelecek)
    const trackingInfo = await getTrackingInfo(trackingNumber, carrier || 'yurtici');

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        items: order.items.map(item => ({
          productTitle: item.product.title,
          quantity: item.quantity,
          image: item.product.images?.[0]
        }))
      },
      tracking: trackingInfo
    });

  } catch (error) {
    console.error('Kargo takip hatası:', error);
    return NextResponse.json({ 
      error: "Kargo takip sırasında bir hata oluştu" 
    }, { status: 500 });
  }
}

async function getTrackingInfo(trackingNumber: string, carrier: string): Promise<TrackingResponse> {
  // Mock tracking data - gerçek uygulamada kargo firması API'sinden gelecek
  const mockTrackingData: Record<string, TrackingResponse> = {
    'YT123456789': {
      trackingNumber: 'YT123456789',
      carrier: 'Yurtiçi Kargo',
      status: 'in_transit',
      estimatedDelivery: '2024-01-15',
      isDelivered: false,
      events: [
        {
          date: '2024-01-12',
          time: '14:30',
          status: 'picked_up',
          location: 'İstanbul Merkez',
          description: 'Kargo alındı',
          statusCode: 'PICKED_UP'
        },
        {
          date: '2024-01-12',
          time: '18:45',
          status: 'in_transit',
          location: 'İstanbul Dağıtım Merkezi',
          description: 'Dağıtım merkezine ulaştı',
          statusCode: 'IN_TRANSIT'
        },
        {
          date: '2024-01-13',
          time: '08:15',
          status: 'in_transit',
          location: 'Ankara Dağıtım Merkezi',
          description: 'Hedef şehire ulaştı',
          statusCode: 'IN_TRANSIT'
        }
      ]
    },
    'AR987654321': {
      trackingNumber: 'AR987654321',
      carrier: 'Aras Kargo',
      status: 'delivered',
      estimatedDelivery: '2024-01-14',
      isDelivered: true,
      deliveryDate: '2024-01-14',
      events: [
        {
          date: '2024-01-11',
          time: '10:20',
          status: 'picked_up',
          location: 'İzmir Merkez',
          description: 'Kargo alındı',
          statusCode: 'PICKED_UP'
        },
        {
          date: '2024-01-11',
          time: '16:30',
          status: 'in_transit',
          location: 'İzmir Dağıtım Merkezi',
          description: 'Dağıtım merkezine ulaştı',
          statusCode: 'IN_TRANSIT'
        },
        {
          date: '2024-01-12',
          time: '09:00',
          status: 'in_transit',
          location: 'Bursa Dağıtım Merkezi',
          description: 'Hedef şehire ulaştı',
          statusCode: 'IN_TRANSIT'
        },
        {
          date: '2024-01-14',
          time: '11:30',
          status: 'delivered',
          location: 'Bursa Osmangazi',
          description: 'Teslim edildi',
          statusCode: 'DELIVERED'
        }
      ]
    }
  };

  // Gerçek takip numarası için mock data döndür
  if (mockTrackingData[trackingNumber]) {
    return mockTrackingData[trackingNumber];
  }

  // Varsayılan tracking bilgileri
  return {
    trackingNumber,
    carrier: getCarrierName(carrier),
    status: 'pending',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isDelivered: false,
    events: [
      {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        status: 'pending',
        location: 'Hazırlanıyor',
        description: 'Sipariş hazırlanıyor',
        statusCode: 'PENDING'
      }
    ]
  };
}

function getCarrierName(carrier: string): string {
  const carriers: Record<string, string> = {
    'yurtici': 'Yurtiçi Kargo',
    'aras': 'Aras Kargo',
    'mng': 'MNG Kargo',
    'ptt': 'PTT Kargo',
    'ups': 'UPS Kargo'
  };
  
  return carriers[carrier] || 'Bilinmeyen Kargo';
}
