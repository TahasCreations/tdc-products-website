/**
 * Shipping Manager
 * 
 * Tüm kargo adapter'larını yönetir ve birleşik API sağlar
 */

import { ShippingAdapter, ShippingAddress, PackageInfo, ShippingQuote, CreateShipmentRequest, CreateShipmentResult, TrackingInfo, ShippingLabel } from './base-adapter';
import { YurticiAdapter } from './yurtici-adapter';
import { ArasAdapter } from './aras-adapter';
import { MNGAdapter } from './mng-adapter';
import { SuratAdapter } from './surat-adapter';
import { PTTAdapter } from './ptt-adapter';

export class ShippingManager {
  private adapters: Map<string, ShippingAdapter>;

  constructor() {
    this.adapters = new Map();
    
    // Kargo adapter'larını yükle
    this.registerAdapter(new YurticiAdapter());
    this.registerAdapter(new ArasAdapter());
    this.registerAdapter(new MNGAdapter());
    this.registerAdapter(new SuratAdapter());
    this.registerAdapter(new PTTAdapter());
  }

  /**
   * Adapter kaydet
   */
  registerAdapter(adapter: ShippingAdapter): void {
    this.adapters.set(adapter.code, adapter);
  }

  /**
   * Tüm kargo firmalarından fiyat teklifi al
   */
  async getAllQuotes(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    packageInfo: PackageInfo,
    carriers?: string[], // Belirli kargo firmaları için filtreleme
  ): Promise<ShippingQuote[]> {
    const quotes: ShippingQuote[] = [];
    const adaptersToUse = carriers 
      ? carriers.map(code => this.adapters.get(code)).filter(Boolean) as ShippingAdapter[]
      : Array.from(this.adapters.values());

    // Paralel olarak tüm adapter'lardan quote al
    const quotePromises = adaptersToUse.map(adapter => 
      adapter.getQuote(sender, recipient, packageInfo).catch(error => {
        console.error(`Error getting quote from ${adapter.name}:`, error);
        return [];
      })
    );

    const results = await Promise.all(quotePromises);
    
    // Tüm quote'ları birleştir
    for (const result of results) {
      quotes.push(...result);
    }

    // Fiyata göre sırala
    return quotes.sort((a, b) => a.price - b.price);
  }

  /**
   * Belirli bir kargo firması ile gönderi oluştur
   */
  async createShipment(
    carrierCode: string,
    request: CreateShipmentRequest,
  ): Promise<CreateShipmentResult> {
    const adapter = this.adapters.get(carrierCode);
    
    if (!adapter) {
      return {
        success: false,
        errors: [`Kargo firması bulunamadı: ${carrierCode}`],
      };
    }

    return adapter.createShipment(request);
  }

  /**
   * Kargo takip
   */
  async track(
    trackingNumber: string,
    carrierCode?: string,
  ): Promise<TrackingInfo | null> {
    // Eğer carrier code verilmişse, sadece o adapter'ı kullan
    if (carrierCode) {
      const adapter = this.adapters.get(carrierCode);
      if (!adapter) {
        return null;
      }
      return adapter.track(trackingNumber);
    }

    // Carrier code yoksa, tüm adapter'larda dene
    for (const adapter of this.adapters.values()) {
      try {
        const tracking = await adapter.track(trackingNumber);
        // Eğer geçerli bir tracking bilgisi döndüyse, onu kullan
        if (tracking && tracking.events.length > 0) {
          return tracking;
        }
      } catch (error) {
        // Bir sonraki adapter'ı dene
        continue;
      }
    }

    return null;
  }

  /**
   * Kargo etiketi al
   */
  async getLabel(
    trackingNumber: string,
    carrierCode: string,
  ): Promise<ShippingLabel | null> {
    const adapter = this.adapters.get(carrierCode);
    
    if (!adapter) {
      return null;
    }

    return adapter.getLabel(trackingNumber);
  }

  /**
   * Kargo iptal et
   */
  async cancelShipment(
    trackingNumber: string,
    carrierCode: string,
  ): Promise<{ success: boolean; errors?: string[] }> {
    const adapter = this.adapters.get(carrierCode);
    
    if (!adapter) {
      return {
        success: false,
        errors: [`Kargo firması bulunamadı: ${carrierCode}`],
      };
    }

    return adapter.cancelShipment(trackingNumber);
  }

  /**
   * Mevcut kargo firmalarını listele
   */
  getAvailableCarriers(): Array<{ code: string; name: string }> {
    return Array.from(this.adapters.values()).map(adapter => ({
      code: adapter.code,
      name: adapter.name,
    }));
  }

  /**
   * Belirli bir kargo firması adapter'ını al
   */
  getAdapter(carrierCode: string): ShippingAdapter | undefined {
    return this.adapters.get(carrierCode);
  }
}

// Singleton instance
let shippingManagerInstance: ShippingManager | null = null;

export function getShippingManager(): ShippingManager {
  if (!shippingManagerInstance) {
    shippingManagerInstance = new ShippingManager();
  }
  return shippingManagerInstance;
}



