/**
 * Aras Kargo Adapter
 * 
 * Aras Kargo API entegrasyonu
 */

import { ShippingAdapter, ShippingAddress, PackageInfo, ShippingQuote, CreateShipmentRequest, CreateShipmentResult, TrackingInfo, ShippingLabel } from './base-adapter';

export class ArasAdapter implements ShippingAdapter {
  readonly name = 'Aras Kargo';
  readonly code = 'ARAS';

  private apiUrl: string;
  private apiKey: string;
  private customerCode: string;
  private password: string;
  private isTestMode: boolean;

  constructor() {
    this.apiUrl = process.env.ARAS_API_URL || 'https://api.araskargo.com.tr';
    this.apiKey = process.env.ARAS_API_KEY || '';
    this.customerCode = process.env.ARAS_CUSTOMER_CODE || '';
    this.password = process.env.ARAS_PASSWORD || '';
    this.isTestMode = process.env.ARAS_TEST_MODE === 'true';
  }

  async getQuote(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    package: PackageInfo,
  ): Promise<ShippingQuote[]> {
    try {
      if (!this.apiKey || !this.customerCode) {
        return this.getMockQuote(sender, recipient, package);
      }

      const response = await fetch(`${this.apiUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          sender: { city: sender.city, district: sender.district },
          recipient: { city: recipient.city, district: recipient.district },
          weight: package.weight,
          dimensions: package.dimensions,
          value: package.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Aras Kargo API error: ${response.statusText}`);
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
      console.error('Aras Kargo quote error:', error);
      return this.getMockQuote(sender, recipient, package);
    }
  }

  async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResult> {
    try {
      if (!this.apiKey || !this.customerCode) {
        return this.createMockShipment(request);
      }

      const response = await fetch(`${this.apiUrl}/shipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          customerCode: this.customerCode,
          password: this.password,
          sender: request.sender,
          recipient: request.recipient,
          package: request.package,
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
      console.error('Aras Kargo create shipment error:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Bilinmeyen hata'],
      };
    }
  }

  async track(trackingNumber: string): Promise<TrackingInfo> {
    try {
      if (!this.apiKey) {
        return this.getMockTracking(trackingNumber);
      }

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
      console.error('Aras Kargo track error:', error);
      return this.getMockTracking(trackingNumber);
    }
  }

  async getLabel(trackingNumber: string): Promise<ShippingLabel | null> {
    try {
      if (!this.apiKey) {
        return {
          trackingNumber,
          labelUrl: `https://www.araskargo.com.tr/kargo-takip?trackingNumber=${trackingNumber}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
      }

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
      console.error('Aras Kargo get label error:', error);
      return null;
    }
  }

  async cancelShipment(trackingNumber: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      if (!this.apiKey) {
        return { success: true };
      }

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
      console.error('Aras Kargo cancel shipment error:', error);
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
    package: PackageInfo,
  ): ShippingQuote[] {
    const basePrice = 20;
    const pricePerKg = 4;
    const price = basePrice + (package.weight > 1 ? (package.weight - 1) * pricePerKg : 0);

    return [
      {
        carrier: this.name,
        service: 'Standart',
        price: Math.round(price * 100) / 100,
        currency: 'TRY',
        estimatedDays: { min: 1, max: 3 },
        features: ['Ekonomik', 'Geniş Ağ', 'Kapıda Ödeme'],
      },
    ];
  }

  private createMockShipment(request: CreateShipmentRequest): CreateShipmentResult {
    const trackingNumber = `ARAS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    return {
      success: true,
      shipmentId: `mock_${Date.now()}`,
      trackingNumber,
      label: {
        trackingNumber,
        labelUrl: `https://www.araskargo.com.tr/kargo-takip?trackingNumber=${trackingNumber}`,
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
      ],
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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



