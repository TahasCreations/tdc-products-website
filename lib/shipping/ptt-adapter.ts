/**
 * PTT Kargo API Adapter
 * 
 * Türkiye'deki PTT Kargo entegrasyonu
 */

import { BaseShippingAdapter, CreateShipmentRequest, ShipmentResponse, TrackResponse } from './base-adapter';

export class PTTAdapter implements ShippingAdapter {
  readonly name = 'PTT Kargo';
  readonly code = 'PTT';
  private apiKey: string;
  private customerCode: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.PTT_API_KEY || '';
    this.customerCode = process.env.PTT_CUSTOMER_CODE || '';
    this.apiUrl = process.env.PTT_API_URL || 'https://api.ptt.gov.tr';
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
          price: 20.00,
          currency: 'TRY',
          estimatedDays: { min: 3, max: 5 },
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
      console.error('PTT Kargo fiyat sorgulama hatası:', error);
      return [];
    }
  }

  async createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResult> {
    try {
      const payload = {
        musteriKodu: this.customerCode,
        referansNo: request.orderNumber,
        gonderici: {
          ad: request.senderName,
          adres: request.senderAddress,
          il: request.senderCity,
          ilce: request.senderDistrict,
          postaKodu: request.senderPostalCode,
          telefon: request.senderPhone,
        },
        alici: {
          ad: request.receiverName,
          adres: request.receiverAddress,
          il: request.receiverCity,
          ilce: request.receiverDistrict,
          postaKodu: request.receiverPostalCode,
          telefon: request.receiverPhone,
        },
        kargo: {
          agirlik: request.weight,
          adet: request.pieces || 1,
          aciklama: request.description,
        },
        odemeTipi: request.paymentMethod === 'credit' ? 'GONDERICI' : 'ALICI',
      };

      const response = await fetch(`${this.apiUrl}/kargo/olustur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'PTT Kargo gönderi oluşturulamadı');
      }

      const result = await response.json();

      return {
        success: true,
        shipmentId: result.shipmentId,
        trackingNumber: result.takipNo,
        label: {
          trackingNumber: result.takipNo,
          labelUrl: result.etiketUrl,
          barcodeUrl: result.barkod,
        },
      };

    } catch (error) {
      console.error('PTT Kargo gönderi oluşturma hatası:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  async track(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const response = await fetch(`${this.apiUrl}/kargo/takip/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('PTT Kargo takip bilgisi alınamadı');
      }

      const result = await response.json();

      return {
        trackingNumber,
        status: this.mapStatus(result.durum),
        events: result.olaylar?.map((e: any) => ({
          date: new Date(e.tarih),
          location: e.konum,
          description: e.aciklama,
          status: e.durum || this.mapStatus(result.durum),
        })) || [],
        estimatedDelivery: result.tahminiTeslimat ? new Date(result.tahminiTeslimat) : undefined,
        carrier: this.name,
      };

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  }

  async getLabel(trackingNumber: string): Promise<ShippingLabel | null> {
    try {
      const response = await fetch(`${this.apiUrl}/kargo/etiket/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('PTT Kargo etiket indirilemedi');
      }

      const result = await response.json();
      return {
        trackingNumber,
        labelUrl: result.etiketUrl,
        barcodeUrl: result.barkodUrl,
      };

    } catch (error) {
      console.error('PTT Kargo etiket indirme hatası:', error);
      return null;
    }
  }

  async cancelShipment(trackingNumber: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const response = await fetch(`${this.apiUrl}/kargo/iptal/${trackingNumber}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          errors: [error.message || 'PTT Kargo iptal edilemedi'],
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
      'DAGITIM': 'out_for_delivery',
      'TESLIM': 'delivered',
      'IADE': 'returned',
      'HATA': 'exception',
    };
    return statusMap[status] || 'unknown';
  }
}

