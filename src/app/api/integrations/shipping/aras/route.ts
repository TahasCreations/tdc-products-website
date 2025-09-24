import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Aras Kargo API status check
    const response = await fetch('https://api.araskargo.com.tr/api/v1/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ARAS_API_KEY || 'demo-key'}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'active',
        service: 'Aras Kargo',
        message: 'Aras Kargo API is working',
        data: {
          totalShipments: 1250,
          delivered: 1200,
          inTransit: 35,
          failed: 15,
          successRate: 96.0,
          avgDeliveryTime: '2.5 days'
        }
      });
    } else {
      return NextResponse.json({
        status: 'inactive',
        service: 'Aras Kargo',
        message: 'Aras Kargo API connection failed',
        error: 'Invalid API key or service unavailable'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'Aras Kargo',
      message: 'Aras Kargo service error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_shipment':
        // Mock shipment creation
        return NextResponse.json({
          success: true,
          message: 'Shipment created successfully',
          trackingNumber: `ARAS${Date.now()}`,
          data: {
            sender: data.sender,
            receiver: data.receiver,
            weight: data.weight,
            dimensions: data.dimensions,
            serviceType: data.serviceType || 'standard',
            status: 'created',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        });

      case 'track_shipment':
        // Mock shipment tracking
        return NextResponse.json({
          success: true,
          data: {
            trackingNumber: data.trackingNumber,
            status: 'in_transit',
            currentLocation: 'İstanbul Dağıtım Merkezi',
            events: [
              {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'İstanbul Dağıtım Merkezi',
                status: 'picked_up',
                description: 'Kargo alındı'
              },
              {
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Ankara Dağıtım Merkezi',
                status: 'in_transit',
                description: 'Yolda'
              }
            ],
            estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        });

      case 'calculate_shipping':
        // Mock shipping calculation
        return NextResponse.json({
          success: true,
          data: {
            weight: data.weight,
            destination: data.destination,
            serviceType: data.serviceType,
            cost: {
              standard: 25.50,
              express: 45.00,
              overnight: 75.00
            },
            estimatedDelivery: {
              standard: '3-5 gün',
              express: '1-2 gün',
              overnight: '1 gün'
            }
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Aras Kargo API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
