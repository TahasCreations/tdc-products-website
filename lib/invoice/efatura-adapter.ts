/**
 * E-Fatura Adapter - GIB (Gelir İdaresi Başkanlığı) API Entegrasyonu
 * 
 * Türkiye'deki e-fatura sistemine uyumlu entegrasyon
 * Desteklenen entegratörler: Foriba, İnvoice, Logo, vb.
 */

import { prisma } from "@/lib/prisma";

export interface EInvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  sellerTaxNumber: string; // VKN
  buyerTaxNumber?: string; // VKN (B2B için)
  buyerTCKN?: string; // TCKN (B2C için)
  buyerName: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    kdvRate: number; // 0, 1, 10, 20
    kdvAmount: number;
    total: number;
  }>;
  subtotal: number;
  totalKDV: number;
  total: number;
  currency: string;
}

export interface EInvoiceResponse {
  success: boolean;
  invoiceUUID?: string;
  invoiceNumber?: string;
  pdfUrl?: string;
  error?: string;
}

export class EFaturaAdapter {
  private apiUrl: string;
  private username: string;
  private password: string;
  private integrator: string; // 'foriba', 'invoice', 'logo', etc.

  constructor() {
    // Environment variables'dan al
    this.apiUrl = process.env.EFATURA_API_URL || '';
    this.username = process.env.EFATURA_USERNAME || '';
    this.password = process.env.EFATURA_PASSWORD || '';
    this.integrator = process.env.EFATURA_INTEGRATOR || 'foriba';
  }

  /**
   * E-Fatura oluştur ve GIB'e gönder
   */
  async createInvoice(data: EInvoiceData): Promise<EInvoiceResponse> {
    try {
      // Entegratöre göre farklı formatlar
      const invoicePayload = this.formatInvoicePayload(data);

      // API çağrısı
      const response = await fetch(`${this.apiUrl}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'E-Fatura oluşturulamadı');
      }

      const result = await response.json();

      return {
        success: true,
        invoiceUUID: result.uuid,
        invoiceNumber: result.invoiceNumber,
        pdfUrl: result.pdfUrl,
      };

    } catch (error) {
      console.error('E-Fatura oluşturma hatası:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Entegratöre göre fatura formatını hazırla
   */
  private formatInvoicePayload(data: EInvoiceData): any {
    switch (this.integrator) {
      case 'foriba':
        return this.formatForForiba(data);
      case 'invoice':
        return this.formatForInvoice(data);
      case 'logo':
        return this.formatForLogo(data);
      default:
        return this.formatForForiba(data); // Default
    }
  }

  /**
   * Foriba formatı
   */
  private formatForForiba(data: EInvoiceData): any {
    return {
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate.toISOString().split('T')[0],
      profile: 'TEMELFATURA', // TEMELFATURA, TICARIFATURA, YOLCUBERABERFATURA, etc.
      line: [
        ...data.items.map((item, index) => ({
          id: index + 1,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.kdvRate,
          vatAmount: item.kdvAmount,
          amount: item.total,
        })),
      ],
      taxExclusiveAmount: data.subtotal,
      taxInclusiveAmount: data.total,
      allowanceTotalAmount: 0,
      taxAmount: data.totalKDV,
      payableAmount: data.total,
      currency: data.currency,
      buyer: {
        identifier: data.buyerTaxNumber || data.buyerTCKN,
        name: data.buyerName,
        address: {
          streetName: data.buyerAddress,
          cityName: data.buyerCity,
          postalZone: data.buyerPostalCode,
          country: 'TR',
        },
      },
    };
  }

  /**
   * İnvoice formatı
   */
  private formatForInvoice(data: EInvoiceData): any {
    // İnvoice entegratörü için format
    return {
      faturaNo: data.invoiceNumber,
      tarih: data.invoiceDate.toISOString().split('T')[0],
      alici: {
        vkn: data.buyerTaxNumber,
        tckn: data.buyerTCKN,
        unvan: data.buyerName,
        adres: data.buyerAddress,
        il: data.buyerCity,
        postaKodu: data.buyerPostalCode,
      },
      kalemler: data.items.map((item) => ({
        malHizmet: item.name,
        miktar: item.quantity,
        birimFiyat: item.unitPrice,
        kdvOrani: item.kdvRate,
        kdvTutari: item.kdvAmount,
        tutar: item.total,
      })),
      araToplam: data.subtotal,
      kdvToplam: data.totalKDV,
      genelToplam: data.total,
    };
  }

  /**
   * Logo formatı
   */
  private formatForLogo(data: EInvoiceData): any {
    // Logo entegratörü için format
    return {
      InvoiceNumber: data.invoiceNumber,
      InvoiceDate: data.invoiceDate.toISOString().split('T')[0],
      Buyer: {
        TaxNumber: data.buyerTaxNumber,
        TCKN: data.buyerTCKN,
        Name: data.buyerName,
        Address: data.buyerAddress,
        City: data.buyerCity,
        PostalCode: data.buyerPostalCode,
      },
      Lines: data.items.map((item) => ({
        Name: item.name,
        Quantity: item.quantity,
        UnitPrice: item.unitPrice,
        VATRate: item.kdvRate,
        VATAmount: item.kdvAmount,
        Total: item.total,
      })),
      SubTotal: data.subtotal,
      VATTotal: data.totalKDV,
      Total: data.total,
    };
  }

  /**
   * Fatura durumunu sorgula
   */
  async getInvoiceStatus(invoiceUUID: string): Promise<{
    status: string;
    pdfUrl?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/invoices/${invoiceUUID}/status`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Fatura durumu sorgulanamadı');
      }

      const result = await response.json();
      return {
        status: result.status, // 'SUCCESS', 'FAILED', 'PENDING'
        pdfUrl: result.pdfUrl,
      };

    } catch (error) {
      return {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Fatura PDF'ini indir
   */
  async downloadInvoicePDF(invoiceUUID: string): Promise<Buffer | null> {
    try {
      const response = await fetch(`${this.apiUrl}/invoices/${invoiceUUID}/pdf`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Fatura PDF indirilemedi');
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);

    } catch (error) {
      console.error('Fatura PDF indirme hatası:', error);
      return null;
    }
  }
}

// Singleton instance
export const eFaturaAdapter = new EFaturaAdapter();
