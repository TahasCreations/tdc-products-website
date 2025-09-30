/**
 * Shipping service - Pure functions for shipping operations
 * Handles shipping calculations, validations, and business logic
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

export interface ShippingZone {
  zoneCode: string;
  countries: string[];
  regions: string[];
  cities: string[];
  baseRates: Record<string, number>;
  surcharges: Record<string, number>;
  estimatedDays: Record<string, number>;
}

export interface ShippingCalculation {
  baseRate: number;
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
  totalPrice: number;
  estimatedDays: number;
  currency: string;
}

/**
 * Calculate shipping cost based on package and destination
 * Pure function - no side effects
 */
export function calculateShippingCost(
  package: PackageDimensions,
  senderAddress: ShippingAddress,
  recipientAddress: ShippingAddress,
  serviceType: string,
  zones: ShippingZone[]
): ShippingCalculation {
  // Determine shipping zone
  const zone = determineShippingZone(recipientAddress, zones);
  
  // Get base rate for service type
  const baseRate = getBaseRate(serviceType, zone);
  
  // Calculate surcharges
  const surcharges = calculateSurcharges(package, serviceType, zone);
  
  // Calculate discounts
  const discounts = calculateDiscounts(package, serviceType, zone);
  
  // Calculate total
  const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0);
  const totalDiscounts = discounts.reduce((sum, d) => sum + d.amount, 0);
  const totalPrice = Math.max(0, baseRate + totalSurcharges - totalDiscounts);
  
  // Get estimated delivery days
  const estimatedDays = getEstimatedDeliveryDays(serviceType, zone);
  
  return {
    baseRate,
    surcharges,
    discounts,
    totalPrice,
    estimatedDays,
    currency: 'TRY'
  };
}

/**
 * Determine shipping zone based on address
 * Pure function - no side effects
 */
export function determineShippingZone(address: ShippingAddress, zones: ShippingZone[]): ShippingZone {
  // Find zone by country first
  let zone = zones.find(z => 
    z.countries.includes(address.country) || 
    z.countries.includes(address.country.toUpperCase())
  );
  
  if (!zone) {
    // Find zone by state/region
    zone = zones.find(z => 
      z.regions.some(region => 
        address.state.toLowerCase().includes(region.toLowerCase()) ||
        region.toLowerCase().includes(address.state.toLowerCase())
      )
    );
  }
  
  if (!zone) {
    // Find zone by city
    zone = zones.find(z => 
      z.cities.some(city => 
        address.city.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(address.city.toLowerCase())
      )
    );
  }
  
  // Default zone if none found
  return zone || {
    zoneCode: 'DEFAULT',
    countries: ['TR'],
    regions: [],
    cities: [],
    baseRates: { 'standard': 15.0, 'express': 25.0, 'economy': 8.0 },
    surcharges: {},
    estimatedDays: { 'standard': 3, 'express': 1, 'economy': 7 }
  };
}

/**
 * Get base rate for service type and zone
 * Pure function - no side effects
 */
function getBaseRate(serviceType: string, zone: ShippingZone): number {
  const serviceRates: Record<string, Record<string, number>> = {
    'ptt-express': { 'DEFAULT': 25.0, 'ISTANBUL': 20.0, 'ANKARA': 22.0 },
    'ptt-standard': { 'DEFAULT': 15.0, 'ISTANBUL': 12.0, 'ANKARA': 14.0 },
    'ptt-economy': { 'DEFAULT': 8.0, 'ISTANBUL': 6.0, 'ANKARA': 7.0 },
    'aras-express': { 'DEFAULT': 30.0, 'ISTANBUL': 25.0, 'ANKARA': 28.0 },
    'aras-standard': { 'DEFAULT': 18.0, 'ISTANBUL': 15.0, 'ANKARA': 16.0 },
    'aras-economy': { 'DEFAULT': 12.0, 'ISTANBUL': 10.0, 'ANKARA': 11.0 },
    'mng-express': { 'DEFAULT': 28.0, 'ISTANBUL': 23.0, 'ANKARA': 25.0 },
    'mng-standard': { 'DEFAULT': 16.0, 'ISTANBUL': 13.0, 'ANKARA': 15.0 },
    'yurtici-express': { 'DEFAULT': 32.0, 'ISTANBUL': 27.0, 'ANKARA': 30.0 },
    'yurtici-standard': { 'DEFAULT': 20.0, 'ISTANBUL': 17.0, 'ANKARA': 18.0 },
    'yurtici-economy': { 'DEFAULT': 14.0, 'ISTANBUL': 12.0, 'ANKARA': 13.0 }
  };
  
  const serviceRatesForType = serviceRates[serviceType] || { 'DEFAULT': 15.0 };
  return serviceRatesForType[zone.zoneCode] || serviceRatesForType['DEFAULT'] || 15.0;
}

/**
 * Calculate surcharges for package
 * Pure function - no side effects
 */
function calculateSurcharges(
  package: PackageDimensions, 
  serviceType: string, 
  zone: ShippingZone
): Array<{ name: string; amount: number; reason: string }> {
  const surcharges: Array<{ name: string; amount: number; reason: string }> = [];
  
  // Weight surcharges
  if (package.weight > 5) {
    surcharges.push({
      name: 'Heavy Package Surcharge',
      amount: (package.weight - 5) * 2.0,
      reason: 'Package exceeds 5kg'
    });
  }
  
  if (package.weight > 20) {
    surcharges.push({
      name: 'Very Heavy Package Surcharge',
      amount: (package.weight - 20) * 3.0,
      reason: 'Package exceeds 20kg'
    });
  }
  
  // Dimension surcharges
  const volume = package.length * package.width * package.height;
  if (volume > 10000) { // 10L
    surcharges.push({
      name: 'Oversized Package Surcharge',
      amount: 5.0,
      reason: 'Package exceeds size limits'
    });
  }
  
  if (volume > 50000) { // 50L
    surcharges.push({
      name: 'Very Large Package Surcharge',
      amount: 10.0,
      reason: 'Package significantly exceeds size limits'
    });
  }
  
  // Service type surcharges
  if (serviceType.includes('express')) {
    surcharges.push({
      name: 'Express Service Surcharge',
      amount: 5.0,
      reason: 'Express delivery service'
    });
  }
  
  // Zone surcharges
  if (zone.zoneCode === 'REMOTE') {
    surcharges.push({
      name: 'Remote Area Surcharge',
      amount: 8.0,
      reason: 'Remote delivery area'
    });
  }
  
  return surcharges;
}

/**
 * Calculate discounts for package
 * Pure function - no side effects
 */
function calculateDiscounts(
  package: PackageDimensions, 
  serviceType: string, 
  zone: ShippingZone
): Array<{ name: string; amount: number; reason: string }> {
  const discounts: Array<{ name: string; amount: number; reason: string }> = [];
  
  // Volume discounts
  if (package.weight > 10) {
    discounts.push({
      name: 'Volume Discount',
      amount: 2.0,
      reason: 'Heavy package discount'
    });
  }
  
  if (package.weight > 30) {
    discounts.push({
      name: 'High Volume Discount',
      amount: 5.0,
      reason: 'Very heavy package discount'
    });
  }
  
  // Economy service discounts
  if (serviceType.includes('economy')) {
    discounts.push({
      name: 'Economy Service Discount',
      amount: 3.0,
      reason: 'Economy delivery service'
    });
  }
  
  // Local delivery discounts
  if (zone.zoneCode === 'LOCAL') {
    discounts.push({
      name: 'Local Delivery Discount',
      amount: 2.0,
      reason: 'Local delivery area'
    });
  }
  
  return discounts;
}

/**
 * Get estimated delivery days for service type and zone
 * Pure function - no side effects
 */
function getEstimatedDeliveryDays(serviceType: string, zone: ShippingZone): number {
  const serviceDays: Record<string, Record<string, number>> = {
    'ptt-express': { 'DEFAULT': 1, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 2 },
    'ptt-standard': { 'DEFAULT': 3, 'ISTANBUL': 2, 'ANKARA': 2, 'REMOTE': 5 },
    'ptt-economy': { 'DEFAULT': 7, 'ISTANBUL': 5, 'ANKARA': 6, 'REMOTE': 10 },
    'aras-express': { 'DEFAULT': 1, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 2 },
    'aras-standard': { 'DEFAULT': 2, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 3 },
    'aras-economy': { 'DEFAULT': 5, 'ISTANBUL': 3, 'ANKARA': 4, 'REMOTE': 7 },
    'mng-express': { 'DEFAULT': 1, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 2 },
    'mng-standard': { 'DEFAULT': 3, 'ISTANBUL': 2, 'ANKARA': 2, 'REMOTE': 4 },
    'yurtici-express': { 'DEFAULT': 1, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 2 },
    'yurtici-standard': { 'DEFAULT': 2, 'ISTANBUL': 1, 'ANKARA': 1, 'REMOTE': 3 },
    'yurtici-economy': { 'DEFAULT': 4, 'ISTANBUL': 3, 'ANKARA': 3, 'REMOTE': 6 }
  };
  
  const serviceDaysForType = serviceDays[serviceType] || { 'DEFAULT': 3 };
  return serviceDaysForType[zone.zoneCode] || serviceDaysForType['DEFAULT'] || 3;
}

/**
 * Validate shipping address
 * Pure function - no side effects
 */
export function validateShippingAddress(address: ShippingAddress): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!address.name || address.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!address.address1 || address.address1.trim().length === 0) {
    errors.push('Address line 1 is required');
  }
  
  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required');
  }
  
  if (!address.state || address.state.trim().length === 0) {
    errors.push('State is required');
  }
  
  if (!address.postalCode || address.postalCode.trim().length === 0) {
    errors.push('Postal code is required');
  }
  
  if (!address.country || address.country.trim().length === 0) {
    errors.push('Country is required');
  }
  
  // Format validations
  if (address.postalCode && !/^\d{5}$/.test(address.postalCode)) {
    warnings.push('Postal code should be 5 digits for Turkey');
  }
  
  if (address.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(address.phone)) {
    warnings.push('Phone number format may be invalid');
  }
  
  if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    warnings.push('Email format may be invalid');
  }
  
  // Country validation
  if (address.country && !['Turkey', 'TR', 'turkey', 'tr'].includes(address.country)) {
    warnings.push('Shipping may not be available to this country');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate package dimensions
 * Pure function - no side effects
 */
export function validatePackageDimensions(package: PackageDimensions): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Weight validation
  if (package.weight <= 0) {
    errors.push('Weight must be greater than 0');
  }
  
  if (package.weight > 50) {
    errors.push('Weight exceeds maximum limit of 50kg');
  }
  
  // Dimension validation
  if (package.length <= 0 || package.width <= 0 || package.height <= 0) {
    errors.push('All dimensions must be greater than 0');
  }
  
  if (package.length > 200 || package.width > 200 || package.height > 200) {
    errors.push('Dimensions exceed maximum limit of 200cm');
  }
  
  // Volume validation
  const volume = package.length * package.width * package.height;
  if (volume > 1000000) { // 1 cubic meter
    warnings.push('Package volume is very large, may require special handling');
  }
  
  // Weight distribution validation
  const density = package.weight / (volume / 1000000); // kg/m³
  if (density > 2000) { // Very dense
    warnings.push('Package is very dense, may require special handling');
  }
  
  if (density < 10) { // Very light
    warnings.push('Package is very light, may be subject to dimensional weight pricing');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate dimensional weight
 * Pure function - no side effects
 */
export function calculateDimensionalWeight(package: PackageDimensions): number {
  // Dimensional weight formula: (L × W × H) / 6000 (for cm/kg)
  const dimensionalWeight = (package.length * package.width * package.height) / 6000;
  return Math.ceil(dimensionalWeight);
}

/**
 * Get chargeable weight (higher of actual weight or dimensional weight)
 * Pure function - no side effects
 */
export function getChargeableWeight(package: PackageDimensions): number {
  const dimensionalWeight = calculateDimensionalWeight(package);
  return Math.max(package.weight, dimensionalWeight);
}

/**
 * Check if package is oversized
 * Pure function - no side effects
 */
export function isPackageOversized(package: PackageDimensions): boolean {
  const maxDimensions = {
    length: 200,
    width: 200,
    height: 200
  };
  
  return package.length > maxDimensions.length ||
         package.width > maxDimensions.width ||
         package.height > maxDimensions.height;
}

/**
 * Check if package is overweight
 * Pure function - no side effects
 */
export function isPackageOverweight(package: PackageDimensions): boolean {
  const maxWeight = 50; // kg
  return package.weight > maxWeight;
}

/**
 * Generate tracking number
 * Pure function - no side effects
 */
export function generateTrackingNumber(provider: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${provider.toUpperCase()}${timestamp}${random}`;
}

/**
 * Generate label number
 * Pure function - no side effects
 */
export function generateLabelNumber(provider: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${provider.toUpperCase()}${timestamp}${random}`;
}

/**
 * Format address for shipping
 * Pure function - no side effects
 */
export function formatAddressForShipping(address: ShippingAddress): string {
  const parts = [
    address.name,
    address.company,
    address.address1,
    address.address2,
    `${address.postalCode} ${address.city}/${address.state}`,
    address.country
  ].filter(Boolean);
  
  return parts.join('\n');
}

/**
 * Calculate distance between two addresses (simplified)
 * Pure function - no side effects
 */
export function calculateAddressDistance(
  address1: ShippingAddress, 
  address2: ShippingAddress
): number {
  // Simplified distance calculation based on city
  const city1 = address1.city.toLowerCase();
  const city2 = address2.city.toLowerCase();
  
  if (city1 === city2) {
    return 0; // Same city
  }
  
  // Mock distances between major Turkish cities
  const distances: Record<string, Record<string, number>> = {
    'istanbul': {
      'ankara': 450,
      'izmir': 350,
      'antalya': 500,
      'bursa': 150,
      'adana': 600
    },
    'ankara': {
      'istanbul': 450,
      'izmir': 400,
      'antalya': 300,
      'bursa': 300,
      'adana': 200
    },
    'izmir': {
      'istanbul': 350,
      'ankara': 400,
      'antalya': 200,
      'bursa': 200,
      'adana': 300
    }
  };
  
  return distances[city1]?.[city2] || 
         distances[city2]?.[city1] || 
         200; // Default distance
}

/**
 * Get shipping zone by address
 * Pure function - no side effects
 */
export function getShippingZoneByAddress(address: ShippingAddress): string {
  const city = address.city.toLowerCase();
  const state = address.state.toLowerCase();
  
  // Major cities
  if (['istanbul', 'ankara', 'izmir', 'bursa'].includes(city)) {
    return 'MAJOR_CITY';
  }
  
  // Regional centers
  if (['antalya', 'adana', 'gaziantep', 'konya', 'mersin'].includes(city)) {
    return 'REGIONAL_CENTER';
  }
  
  // Remote areas
  if (['hakkari', 'şırnak', 'van', 'ağrı'].includes(city)) {
    return 'REMOTE';
  }
  
  // Default
  return 'STANDARD';
}

/**
 * Validate shipping service availability
 * Pure function - no side effects
 */
export function validateServiceAvailability(
  serviceType: string,
  senderAddress: ShippingAddress,
  recipientAddress: ShippingAddress,
  package: PackageDimensions
): {
  isAvailable: boolean;
  reason?: string;
  alternatives?: string[];
} {
  // Check if service is available for the route
  const senderZone = getShippingZoneByAddress(senderAddress);
  const recipientZone = getShippingZoneByAddress(recipientAddress);
  
  // Express services may not be available to remote areas
  if (serviceType.includes('express') && recipientZone === 'REMOTE') {
    return {
      isAvailable: false,
      reason: 'Express service not available to remote areas',
      alternatives: ['standard', 'economy']
    };
  }
  
  // Check package restrictions
  if (isPackageOversized(package) || isPackageOverweight(package)) {
    return {
      isAvailable: false,
      reason: 'Package exceeds size or weight limits',
      alternatives: []
    };
  }
  
  // Check international shipping
  if (recipientAddress.country !== 'Turkey' && recipientAddress.country !== 'TR') {
    if (!serviceType.includes('international')) {
      return {
        isAvailable: false,
        reason: 'International shipping not available for this service',
        alternatives: ['international-express', 'international-standard']
      };
    }
  }
  
  return {
    isAvailable: true
  };
}

