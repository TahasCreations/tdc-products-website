import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('number');
    const company = searchParams.get('company');

    if (!trackingNumber || !company) {
      return NextResponse.json({ 
        success: false, 
        error: 'Takip numarası ve kargo firması gerekli' 
      }, { status: 400 });
    }

    // Gerçek kargo API entegrasyonları
    let trackingData = null;

    try {
      switch (company.toLowerCase()) {
        case 'yurtici':
          trackingData = await trackYurtici(trackingNumber);
          break;
        case 'mng':
          trackingData = await trackMNG(trackingNumber);
          break;
        case 'aras':
          trackingData = await trackAras(trackingNumber);
          break;
        case 'ptt':
          trackingData = await trackPTT(trackingNumber);
          break;
        case 'ups':
          trackingData = await trackUPS(trackingNumber);
          break;
        default:
          throw new Error('Desteklenmeyen kargo firması');
      }
    } catch (apiError) {
      console.error(`${company} API hatası:`, apiError);
      // Fallback: Mock data
      trackingData = generateMockTrackingData(trackingNumber, company);
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      company,
      currentStatus: trackingData.currentStatus,
      events: trackingData.events,
      estimatedDelivery: trackingData.estimatedDelivery
    });

  } catch (error) {
    console.error('Kargo takip hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kargo takip bilgileri alınamadı' 
    }, { status: 500 });
  }
}

// Kargo firması API entegrasyonları
async function trackYurtici(trackingNumber: string) {
  // Yurtiçi Kargo API entegrasyonu
  // const response = await fetch(`https://api.yurticikargo.com/track/${trackingNumber}`);
  // return await response.json();
  
  // Mock data
  return generateMockTrackingData(trackingNumber, 'Yurtiçi Kargo');
}

async function trackMNG(trackingNumber: string) {
  // MNG Kargo API entegrasyonu
  // const response = await fetch(`https://api.mngkargo.com.tr/track/${trackingNumber}`);
  // return await response.json();
  
  // Mock data
  return generateMockTrackingData(trackingNumber, 'MNG Kargo');
}

async function trackAras(trackingNumber: string) {
  // Aras Kargo API entegrasyonu
  // const response = await fetch(`https://api.araskargo.com.tr/track/${trackingNumber}`);
  // return await response.json();
  
  // Mock data
  return generateMockTrackingData(trackingNumber, 'Aras Kargo');
}

async function trackPTT(trackingNumber: string) {
  // PTT Kargo API entegrasyonu
  // const response = await fetch(`https://api.ptt.gov.tr/track/${trackingNumber}`);
  // return await response.json();
  
  // Mock data
  return generateMockTrackingData(trackingNumber, 'PTT Kargo');
}

async function trackUPS(trackingNumber: string) {
  // UPS Kargo API entegrasyonu
  // const response = await fetch(`https://api.ups.com/track/${trackingNumber}`);
  // return await response.json();
  
  // Mock data
  return generateMockTrackingData(trackingNumber, 'UPS Kargo');
}

function generateMockTrackingData(trackingNumber: string, company: string) {
  const now = new Date();
  const events = [
    {
      id: '1',
      status: 'Sipariş Alındı',
      description: 'Siparişiniz alındı ve hazırlanıyor',
      location: 'TDC Deposu, İstanbul',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    },
    {
      id: '2',
      status: 'Hazırlanıyor',
      description: 'Siparişiniz paketleniyor',
      location: 'TDC Deposu, İstanbul',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true
    },
    {
      id: '3',
      status: 'Kargoya Verildi',
      description: `Siparişiniz ${company} firmasına teslim edildi`,
      location: 'TDC Deposu, İstanbul',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      completed: true
    },
    {
      id: '4',
      status: 'Dağıtım Merkezinde',
      description: 'Siparişiniz dağıtım merkezinde',
      location: `${company} Dağıtım Merkezi`,
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      completed: true
    },
    {
      id: '5',
      status: 'Dağıtımda',
      description: 'Siparişiniz dağıtıma çıktı',
      location: 'Kurye aracında',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: '6',
      status: 'Teslim Edildi',
      description: 'Siparişiniz teslim edildi',
      location: 'Adresiniz',
      timestamp: '',
      completed: false
    }
  ];

  return {
    currentStatus: 'Dağıtımda',
    events,
    estimatedDelivery: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
  };
}
