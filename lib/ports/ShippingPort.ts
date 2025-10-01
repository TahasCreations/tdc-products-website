// Shipping Port Interface
export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: number;
  service: string;
  carrier: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Package {
  weight: number; // in kg
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
  value: number;  // in currency
  currency: string;
}

export interface ShippingOptions {
  from: ShippingAddress;
  to: ShippingAddress;
  packages: Package[];
  service?: string;
  storeId?: string;
}

export interface ShippingLabel {
  id: string;
  trackingNumber: string;
  labelUrl: string;
  trackingUrl: string;
  price: number;
  currency: string;
  estimatedDelivery: Date;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'exception' | 'returned';
  events: TrackingEvent[];
  estimatedDelivery?: Date;
  carrier: string;
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location?: string;
  description: string;
}

export interface ShippingPort {
  getRates(options: ShippingOptions): Promise<ShippingRate[]>;
  createLabel(options: ShippingOptions, rateId: string): Promise<ShippingLabel>;
  cancelLabel(labelId: string): Promise<boolean>;
  trackPackage(trackingNumber: string): Promise<TrackingInfo>;
  validateAddress(address: ShippingAddress): Promise<boolean>;
}
