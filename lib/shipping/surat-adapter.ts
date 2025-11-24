/**
 * Sürat Kargo API Adapter
 * 
 * Türkiye'deki Sürat Kargo entegrasyonu
 */

import { BaseShippingAdapter, CreateShipmentRequest, ShipmentResponse, TrackResponse } from './base-adapter';

export class SuratAdapter implements ShippingAdapter {
  readonly name = 'Sürat Kargo';
  readonly code = 'SURAT';
  private apiKey: string;
  private customerCode: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.SURAT_API_KEY || '';
    this.customerCode = process.env.SURAT_CUSTOMER_CODE || '';
    this.apiUrl = process.env.SURAT_API_URL || 'https://api.suratkargo.com.tr';
  }

  async getQuote(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    package: PackageInfo,
  ): Promise<ShippingQuote[]> {
    try {
      // API bilgileri yoksa mock response döndür
      if (!this.apiKey || !this.customerCode) {
        return [{
          carrier: this.name,
          service: 'Standard',
          price: 25.00,
          currency: 'TRY',
          estimatedDays: { min: 2, max: 4 },
        }];
      }

      const response = await fetch(`${this.apiUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          sender,
          recipient,
          package,
        }),
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return result.quotes || [];

    } catch (error) {
      console.error('Sürat Kargo fiyat sorgulama hatası:', error);
      return [];
    }
  }

  async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResult> {
    try {
      const payload = {
        customerCode: this.customerCode,
        referenceNumber: request.reference,
        sender: {
          name: request.sender.name,
          address: request.sender.address,
          city: request.sender.city,
          district: request.sender.district,
          postalCode: request.sender.postalCode,
          phone: request.sender.phone,
        },
        receiver: {
          name: request.recipient.name,
          address: request.recipient.address,
          city: request.recipient.city,
          district: request.recipient.district,
          postalCode: request.recipient.postalCode,
          phone: request.recipient.phone,
        },
        package: {
          weight: request.package.weight,
          pieces: 1,
          description: request.package.description,
        },
        paymentType: request.codAmount ? 'COLLECT' : 'PREPAID',
      };

      const response = await fetch(`${this.apiUrl}/shipment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sürat Kargo gönderi oluşturulamadı');
      }

      const result = await response.json();

      return {
        success: true,
        shipmentId: result.shipmentId,
        trackingNumber: result.trackingNumber,
        label: {
          trackingNumber: result.trackingNumber,
          labelUrl: result.labelUrl,
          barcodeUrl: result.barcode,
        },
      };

    } catch (error) {
      console.error('Sürat Kargo gönderi oluşturma hatası:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  async track(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const response = await fetch(`${this.apiUrl}/tracking/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Sürat Kargo takip bilgisi alınamadı');
      }

      const result = await response.json();

      return {
        trackingNumber,
        status: this.mapStatus(result.status),
        events: result.events?.map((e: any) => ({
          date: new Date(e.date),
          location: e.location,
          description: e.description,
          status: e.status || this.mapStatus(result.status),
        })) || [],
        estimatedDelivery: result.estimatedDelivery ? new Date(result.estimatedDelivery) : undefined,
        carrier: this.name,
      };

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  }

  async getLabel(trackingNumber: string): Promise<ShippingLabel | null> {
    try {
      const response = await fetch(`${this.apiUrl}/label/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Sürat Kargo etiket indirilemedi');
      }

      const result = await response.json();
      return {
        trackingNumber,
        labelUrl: result.labelUrl,
        barcodeUrl: result.barcodeUrl,
      };

    } catch (error) {
      console.error('Sürat Kargo etiket indirme hatası:', error);
      return null;
    }
  }

  async cancelShipment(trackingNumber: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const response = await fetch(`${this.apiUrl}/shipment/${trackingNumber}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          errors: [error.message || 'Sürat Kargo iptal edilemedi'],
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Bilinmeyen hata'],
      };
    }
  }

  private mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'KABUL': 'accepted',
      'TRANSIT': 'in_transit',
      'DISTRIBUTION': 'out_for_delivery',
      'DELIVERED': 'delivered',
      'RETURNED': 'returned',
      'EXCEPTION': 'exception',
    };
    return statusMap[status] || 'unknown';
  }
}

