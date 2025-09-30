/**
 * Shipping Port - Interface for shipping operations
 * Supports multiple shipping providers (PTT, Aras, MNG, etc.)
 */

export interface ShippingAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface PackageDimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
  weight: number; // kg
}

export interface ShippingService {
  id: string;
  name: string;
  description?: string;
  estimatedDays: number;
  price: number;
  currency: string;
  isAvailable: boolean;
  features: string[];
}

export interface ShippingRate {
  serviceId: string;
  serviceName: string;
  price: number;
  currency: string;
  estimatedDays: number;
  features: string[];
  surcharges: Array<{
    name: string;
    amount: number;
    reason: string;
  }>;
  discounts: Array<{
    name: string;
    amount: number;
    reason: string;
  }>;
}

export interface ShippingLabel {
  id: string;
  labelNumber: string;
  trackingNumber: string;
  serviceType: string;
  status: 'CREATED' | 'PRINTED' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED' | 'CANCELLED' | 'ERROR';
  
  // Package details
  weight: number;
  dimensions: PackageDimensions;
  packageType: string;
  
  // Addresses
  senderAddress: ShippingAddress;
  recipientAddress: ShippingAddress;
  
  // Pricing
  basePrice: number;
  surcharges: number;
  discounts: number;
  totalPrice: number;
  currency: string;
  
  // Provider details
  providerLabelId?: string;
  labelUrl?: string;
  barcodeUrl?: string;
  
  // Dates
  createdAt: Date;
  printedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  
  // Error handling
  errorMessage?: string;
  retryCount: number;
  lastRetryAt?: Date;
  
  // Metadata
  notes?: string;
  metadata?: any;
}

export interface TrackingEvent {
  id: string;
  eventType: 'LABEL_CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED' | 'EXCEPTION' | 'CANCELLED';
  eventName: string;
  description?: string;
  
  // Location
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  
  // Status
  status?: string;
  statusCode?: string;
  
  // Dates
  eventDate: Date;
  recordedAt: Date;
  
  // Provider data
  providerEventId?: string;
  providerData?: any;
  
  // Metadata
  metadata?: any;
}

export interface ShippingContract {
  id: string;
  contractName: string;
  provider: 'PTT' | 'ARAS' | 'MNG' | 'YURTICI' | 'SENDEX' | 'UPS' | 'DHL' | 'FEDEX' | 'CUSTOM';
  contractNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TERMINATED';
  
  // Provider configuration
  providerConfig: any;
  apiCredentials: any;
  
  // Service configuration
  services: string[];
  zones: string[];
  weightLimits?: any;
  dimensionLimits?: any;
  
  // Pricing
  baseRates?: any;
  surcharges?: any;
  discounts?: any;
  
  // Contract terms
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  noticePeriod?: number;
  
  // Contact information
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  
  // Status tracking
  lastUsedAt?: Date;
  usageCount: number;
  errorCount: number;
  lastErrorAt?: Date;
  lastErrorMessage?: string;
  
  // Metadata
  description?: string;
  tags: string[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLabelRequest {
  orderId: string;
  contractId: string;
  serviceType: string;
  
  // Package details
  weight: number;
  dimensions: PackageDimensions;
  packageType?: string;
  
  // Addresses
  senderAddress: ShippingAddress;
  recipientAddress: ShippingAddress;
  
  // Additional options
  insuranceValue?: number;
  codAmount?: number;
  signatureRequired?: boolean;
  fragile?: boolean;
  notes?: string;
  metadata?: any;
}

export interface CreateLabelResponse {
  success: boolean;
  label?: ShippingLabel;
  error?: string;
  errorCode?: string;
  retryAfter?: number;
}

export interface CancelLabelRequest {
  labelId: string;
  reason?: string;
}

export interface CancelLabelResponse {
  success: boolean;
  refundAmount?: number;
  error?: string;
  errorCode?: string;
}

export interface GetRatesRequest {
  senderAddress: ShippingAddress;
  recipientAddress: ShippingAddress;
  package: PackageDimensions;
  services?: string[];
  contractId?: string;
}

export interface GetRatesResponse {
  success: boolean;
  rates?: ShippingRate[];
  error?: string;
  errorCode?: string;
}

export interface TrackPackageRequest {
  trackingNumber: string;
  contractId?: string;
}

export interface TrackPackageResponse {
  success: boolean;
  trackingEvents?: TrackingEvent[];
  currentStatus?: string;
  estimatedDelivery?: Date;
  error?: string;
  errorCode?: string;
}

export interface ValidateAddressRequest {
  address: ShippingAddress;
  contractId?: string;
}

export interface ValidateAddressResponse {
  success: boolean;
  isValid: boolean;
  normalizedAddress?: ShippingAddress;
  suggestions?: ShippingAddress[];
  error?: string;
  errorCode?: string;
}

export interface ShippingPort {
  /**
   * Get available shipping services for a contract
   */
  getAvailableServices(contractId: string): Promise<ShippingService[]>;

  /**
   * Get shipping rates for a package
   */
  getRates(request: GetRatesRequest): Promise<GetRatesResponse>;

  /**
   * Create a shipping label
   */
  createLabel(request: CreateLabelRequest): Promise<CreateLabelResponse>;

  /**
   * Cancel a shipping label
   */
  cancelLabel(request: CancelLabelRequest): Promise<CancelLabelResponse>;

  /**
   * Track a package
   */
  trackPackage(request: TrackPackageRequest): Promise<TrackPackageResponse>;

  /**
   * Get label details
   */
  getLabel(labelId: string): Promise<ShippingLabel | null>;

  /**
   * Download label PDF
   */
  downloadLabel(labelId: string): Promise<{ success: boolean; pdfData?: Buffer; error?: string }>;

  /**
   * Print label
   */
  printLabel(labelId: string, printerId?: string): Promise<{ success: boolean; error?: string }>;

  /**
   * Validate address
   */
  validateAddress(request: ValidateAddressRequest): Promise<ValidateAddressResponse>;

  /**
   * Get tracking events for a label
   */
  getTrackingEvents(labelId: string): Promise<TrackingEvent[]>;

  /**
   * Update label status
   */
  updateLabelStatus(labelId: string, status: string, metadata?: any): Promise<{ success: boolean; error?: string }>;

  /**
   * Get contract details
   */
  getContract(contractId: string): Promise<ShippingContract | null>;

  /**
   * Test contract connection
   */
  testConnection(contractId: string): Promise<{ success: boolean; error?: string; responseTime?: number }>;

  /**
   * Get provider capabilities
   */
  getProviderCapabilities(provider: string): Promise<{
    supportedServices: string[];
    supportedCountries: string[];
    supportedPackageTypes: string[];
    maxWeight: number;
    maxDimensions: PackageDimensions;
    features: string[];
  }>;

  /**
   * Health check for shipping service
   */
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;

  /**
   * Get system capabilities
   */
  getCapabilities(): Promise<{
    supportedProviders: string[];
    supportedServices: string[];
    maxConcurrentRequests: number;
    rateLimitPerMinute: number;
    supportedFormats: string[];
  }>;
}

