/**
 * Yurtiçi Kargo Adapter
 * 
 * Yurtiçi Kargo API entegrasyonu
 * 
 * NOT: Gerçek entegrasyon için Yurtiçi Kargo API bilgileri gereklidir:
 * - API Endpoint
 * - API Key
 * - Müşteri Kodu
 * - Şifre
 */

import { ShippingAdapter, ShippingAddress, PackageInfo, ShippingQuote, CreateShipmentRequest, CreateShipmentResult, TrackingInfo, ShippingLabel } from './base-adapter';

export class YurticiAdapter implements ShippingAdapter {
  readonly name = 'Yurtiçi Kargo';
  readonly code = 'YURTICI';

  private apiUrl: string;
  private apiKey: string;
  private customerCode: string;
  private password: string;
  private isTestMode: boolean;

  constructor() {
    this.apiUrl = process.env.YURTICI_API_URL || 'https://api.yurticikargo.com';
    this.apiKey = process.env.YURTICI_API_KEY || '';
    this.customerCode = process.env.YURTICI_CUSTOMER_CODE || '';
    this.password = process.env.YURTICI_PASSWORD || '';
    this.isTestMode = process.env.YURTICI_TEST_MODE === 'true';
  }

  async getQuote(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    packageInfo: PackageInfo,
  ): Promise<ShippingQuote[]> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey || !this.customerCode) {
        return this.getMockQuote(sender, recipient, packageInfo);
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.apiUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          sender: {
            city: sender.city,
            district: sender.district,
            postalCode: sender.postalCode,
          },
          recipient: {
            city: recipient.city,
            district: recipient.district,
            postalCode: recipient.postalCode,
          },
          weight: packageInfo.weight,
          dimensions: packageInfo.dimensions,
          value: packageInfo.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Yurtiçi Kargo API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.services.map((service: any) => ({
        carrier: this.name,
        service: service.name,
        price: service.price,
        currency: 'TRY',
        estimatedDays: {
          min: service.estimatedDaysMin,
          max: service.estimatedDaysMax,
        },
        features: service.features || [],
      }));

    } catch (error) {
      console.error('Yurtiçi Kargo quote error:', error);
      // Hata durumunda mock quote döndür
        return this.getMockQuote(sender, recipient, packageInfo);
    }
  }

  async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResult> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey || !this.customerCode) {
        return this.createMockShipment(request);
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.apiUrl}/shipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          customerCode: this.customerCode,
          password: this.password,
          sender: {
            name: request.sender.name,
            phone: request.sender.phone,
            email: request.sender.email,
            address: request.sender.address,
            district: request.sender.district,
            city: request.sender.city,
            postalCode: request.sender.postalCode,
          },
          recipient: {
            name: request.recipient.name,
            phone: request.recipient.phone,
            email: request.recipient.email,
            address: request.recipient.address,
            district: request.recipient.district,
            city: request.recipient.city,
            postalCode: request.recipient.postalCode,
          },
          package: {
            weight: request.package.weight,
            dimensions: request.package.dimensions,
            value: request.package.value,
            description: request.package.description,
          },
          service: request.service || 'STANDARD',
          reference: request.reference,
          codAmount: request.codAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          errors: [errorData.message || `API error: ${response.statusText}`],
        };
      }

      const data = await response.json();

      return {
        success: true,
        shipmentId: data.shipmentId,
        trackingNumber: data.trackingNumber,
        label: {
          trackingNumber: data.trackingNumber,
          labelUrl: data.labelUrl,
          barcodeUrl: data.barcodeUrl,
          expiresAt: data.labelExpiresAt ? new Date(data.labelExpiresAt) : undefined,
        },
      };

    } catch (error) {
      console.error('Yurtiçi Kargo create shipment error:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Bilinmeyen hata'],
      };
    }
  }

  async track(trackingNumber: string): Promise<TrackingInfo> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey) {
        return this.getMockTracking(trackingNumber);
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.apiUrl}/track/${trackingNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Tracking API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        trackingNumber,
        status: this.mapStatus(data.status),
        events: data.events.map((event: any) => ({
          date: new Date(event.date),
          location: event.location,
          description: event.description,
          status: event.status,
        })),
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
        carrier: this.name,
      };

    } catch (error) {
      console.error('Yurtiçi Kargo track error:', error);
      return this.getMockTracking(trackingNumber);
    }
  }

  async getLabel(trackingNumber: string): Promise<ShippingLabel | null> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey) {
        return {
          trackingNumber,
          labelUrl: `https://www.yurticikargo.com/tr/kargo-takip?trackingNumber=${trackingNumber}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.apiUrl}/label/${trackingNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      return {
        trackingNumber,
        labelUrl: data.labelUrl,
        barcodeUrl: data.barcodeUrl,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      };

    } catch (error) {
      console.error('Yurtiçi Kargo get label error:', error);
      return null;
    }
  }

  async cancelShipment(trackingNumber: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey) {
        return { success: true };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.apiUrl}/shipment/${trackingNumber}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          errors: [errorData.message || `API error: ${response.statusText}`],
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Yurtiçi Kargo cancel shipment error:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Bilinmeyen hata'],
      };
    }
  }

  // Helper methods
  private getMockQuote(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    packageInfo: PackageInfo,
  ): ShippingQuote[] {
    const basePrice = 25;
    const pricePerKg = 5;
    const price = basePrice + (packageInfo.weight > 1 ? (packageInfo.weight - 1) * pricePerKg : 0);

    return [
      {
        carrier: this.name,
        service: 'Standart',
        price: Math.round(price * 100) / 100,
        currency: 'TRY',
        estimatedDays: { min: 1, max: 2 },
        features: ['Hızlı Teslimat', 'Güvenli', 'Takip'],
      },
      {
        carrier: this.name,
        service: 'Express',
        price: Math.round(price * 1.5 * 100) / 100,
        currency: 'TRY',
        estimatedDays: { min: 1, max: 1 },
        features: ['Aynı Gün', 'Öncelikli', 'Takip'],
      },
    ];
  }

  private createMockShipment(request: CreateShipmentRequest): CreateShipmentResult {
    const trackingNumber = `YURTICI${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    return {
      success: true,
      shipmentId: `mock_${Date.now()}`,
      trackingNumber,
      label: {
        trackingNumber,
        labelUrl: `https://www.yurticikargo.com/tr/kargo-takip?trackingNumber=${trackingNumber}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    };
  }

  private getMockTracking(trackingNumber: string): TrackingInfo {
    return {
      trackingNumber,
      status: 'in_transit',
      events: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          location: 'İstanbul',
          description: 'Kargo alındı',
          status: 'in_transit',
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          location: 'Ankara',
          description: 'Dağıtım merkezine ulaştı',
          status: 'in_transit',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      carrier: this.name,
    };
  }

  private mapStatus(status: string): TrackingInfo['status'] {
    const statusMap: Record<string, TrackingInfo['status']> = {
      'pending': 'pending',
      'picked_up': 'in_transit',
      'in_transit': 'in_transit',
      'out_for_delivery': 'out_for_delivery',
      'delivered': 'delivered',
      'exception': 'exception',
      'returned': 'returned',
    };

    return statusMap[status.toLowerCase()] || 'pending';
  }
}



