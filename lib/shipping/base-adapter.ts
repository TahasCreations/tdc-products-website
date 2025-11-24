/**
 * Base Shipping Adapter Interface
 * 
 * Tüm kargo firması adapter'ları bu interface'i implement eder
 */

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  district?: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface PackageInfo {
  weight: number; // kg
  dimensions?: {
    length: number; // cm
    width: number; // cm
    height: number; // cm
  };
  value?: number; // TL
  description?: string;
}

export interface ShippingLabel {
  trackingNumber: string;
  labelUrl: string; // PDF URL
  barcodeUrl?: string; // Barcode image URL
  expiresAt?: Date;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned';
  events: Array<{
    date: Date;
    location: string;
    description: string;
    status: string;
  }>;
  estimatedDelivery?: Date;
  carrier: string;
}

export interface ShippingQuote {
  carrier: string;
  service: string;
  price: number;
  currency: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  features?: string[];
}

export interface CreateShipmentRequest {
  sender: ShippingAddress;
  recipient: ShippingAddress;
  package: PackageInfo;
  service?: string; // Express, Standard, etc.
  reference?: string; // Order number, etc.
  insurance?: boolean;
  codAmount?: number; // Kapıda ödeme tutarı
}

export interface CreateShipmentResult {
  success: boolean;
  shipmentId?: string;
  trackingNumber?: string;
  label?: ShippingLabel;
  errors?: string[];
}

/**
 * Base Shipping Adapter Interface
 */
export interface ShippingAdapter {
  /**
   * Kargo firması adı
   */
  readonly name: string;
  
  /**
   * Kargo firması kodu
   */
  readonly code: string;

  /**
   * Kargo fiyat teklifi al
   */
  getQuote(
    sender: ShippingAddress,
    recipient: ShippingAddress,
    package: PackageInfo,
  ): Promise<ShippingQuote[]>;

  /**
   * Kargo gönderisi oluştur
   */
  createShipment(request: CreateShipmentRequest): Promise<CreateShipmentResult>;

  /**
   * Kargo takip bilgisi al
   */
  track(trackingNumber: string): Promise<TrackingInfo>;

  /**
   * Kargo etiketi indir
   */
  getLabel(trackingNumber: string): Promise<ShippingLabel | null>;

  /**
   * Kargo iptal et
   */
  cancelShipment(trackingNumber: string): Promise<{ success: boolean; errors?: string[] }>;
}



