/**
 * International Shipping Integration
 * Multi-carrier, customs, duties calculator
 */

export interface Country {
  code: string;
  name: string;
  nameEN: string;
  flag: string;
  currency: string;
  shippingZone: 'eu' | 'usa' | 'asia' | 'middle_east' | 'other';
  isSupported: boolean;
}

export interface ShippingRate {
  carrier: string;
  serviceName: string;
  estimatedDays: string;
  price: number;
  currency: string;
  trackingAvailable: boolean;
  insuranceIncluded: boolean;
}

export interface CustomsInfo {
  dutyRate: number;
  taxRate: number;
  estimatedDuty: number;
  estimatedTax: number;
  totalCustomsFees: number;
  isRequired: boolean;
}

class InternationalShippingManager {
  private supportedCountries: Country[] = [
    // Europe
    { code: 'TR', name: 'Türkiye', nameEN: 'Turkey', flag: '🇹🇷', currency: 'TRY', shippingZone: 'eu', isSupported: true },
    { code: 'DE', name: 'Almanya', nameEN: 'Germany', flag: '🇩🇪', currency: 'EUR', shippingZone: 'eu', isSupported: true },
    { code: 'FR', name: 'Fransa', nameEN: 'France', flag: '🇫🇷', currency: 'EUR', shippingZone: 'eu', isSupported: true },
    { code: 'GB', name: 'İngiltere', nameEN: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', shippingZone: 'eu', isSupported: true },
    { code: 'IT', name: 'İtalya', nameEN: 'Italy', flag: '🇮🇹', currency: 'EUR', shippingZone: 'eu', isSupported: true },
    { code: 'ES', name: 'İspanya', nameEN: 'Spain', flag: '🇪🇸', currency: 'EUR', shippingZone: 'eu', isSupported: true },
    { code: 'NL', name: 'Hollanda', nameEN: 'Netherlands', flag: '🇳🇱', currency: 'EUR', shippingZone: 'eu', isSupported: true },
    
    // USA
    { code: 'US', name: 'Amerika', nameEN: 'United States', flag: '🇺🇸', currency: 'USD', shippingZone: 'usa', isSupported: true },
    { code: 'CA', name: 'Kanada', nameEN: 'Canada', flag: '🇨🇦', currency: 'CAD', shippingZone: 'usa', isSupported: true },
    
    // Middle East
    { code: 'SA', name: 'Suudi Arabistan', nameEN: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', shippingZone: 'middle_east', isSupported: true },
    { code: 'AE', name: 'BAE', nameEN: 'UAE', flag: '🇦🇪', currency: 'AED', shippingZone: 'middle_east', isSupported: true },
    { code: 'QA', name: 'Katar', nameEN: 'Qatar', flag: '🇶🇦', currency: 'QAR', shippingZone: 'middle_east', isSupported: true },
    
    // Asia
    { code: 'CN', name: 'Çin', nameEN: 'China', flag: '🇨🇳', currency: 'CNY', shippingZone: 'asia', isSupported: true },
    { code: 'JP', name: 'Japonya', nameEN: 'Japan', flag: '🇯🇵', currency: 'JPY', shippingZone: 'asia', isSupported: true },
    { code: 'KR', name: 'Güney Kore', nameEN: 'South Korea', flag: '🇰🇷', currency: 'KRW', shippingZone: 'asia', isSupported: true },
    { code: 'SG', name: 'Singapur', nameEN: 'Singapore', flag: '🇸🇬', currency: 'SGD', shippingZone: 'asia', isSupported: true }
  ];

  /**
   * Get all supported countries
   */
  getSupportedCountries(): Country[] {
    return this.supportedCountries.filter(c => c.isSupported);
  }

  /**
   * Get shipping rates for country
   */
  async getShippingRates(
    countryCode: string,
    weight: number, // kg
    value: number // TRY
  ): Promise<ShippingRate[]> {
    try {
      const response = await fetch('/api/shipping/international/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, weight, value })
      });

      if (response.ok) {
        const data = await response.json();
        return data.rates || [];
      }
      return [];
    } catch (error) {
      console.error('Get shipping rates error:', error);
      return [];
    }
  }

  /**
   * Calculate customs and duties
   */
  async calculateCustoms(
    countryCode: string,
    productValue: number,
    category: string
  ): Promise<CustomsInfo> {
    // Simplified calculation (in production, use real API)
    const country = this.supportedCountries.find(c => c.code === countryCode);
    
    if (!country || country.code === 'TR') {
      return {
        dutyRate: 0,
        taxRate: 0,
        estimatedDuty: 0,
        estimatedTax: 0,
        totalCustomsFees: 0,
        isRequired: false
      };
    }

    // Default rates (vary by country and product category)
    const dutyRate = country.shippingZone === 'eu' ? 0 : 10; // EU: 0%, Others: ~10%
    const taxRate = country.shippingZone === 'eu' ? 20 : 0; // EU VAT: ~20%

    const estimatedDuty = (productValue * dutyRate) / 100;
    const estimatedTax = ((productValue + estimatedDuty) * taxRate) / 100;

    return {
      dutyRate,
      taxRate,
      estimatedDuty,
      estimatedTax,
      totalCustomsFees: estimatedDuty + estimatedTax,
      isRequired: true
    };
  }

  /**
   * Get currency conversion rate
   */
  async convertCurrency(
    amount: number,
    from: string = 'TRY',
    to: string
  ): Promise<number> {
    if (from === to) return amount;

    try {
      const response = await fetch(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`);
      if (response.ok) {
        const data = await response.json();
        return data.convertedAmount || amount;
      }
      return amount;
    } catch (error) {
      console.error('Currency conversion error:', error);
      return amount;
    }
  }

  /**
   * Validate international address
   */
  validateAddress(address: {
    country: string;
    city: string;
    postalCode: string;
    addressLine1: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.country) errors.push('Ülke seçilmedi');
    if (!address.city) errors.push('Şehir girilmedi');
    if (!address.postalCode) errors.push('Posta kodu girilmedi');
    if (!address.addressLine1) errors.push('Adres girilmedi');

    // Postal code format validation (basic)
    if (address.postalCode) {
      const country = this.supportedCountries.find(c => c.code === address.country);
      // Add specific validations per country if needed
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate customs declaration
   */
  generateCustomsDeclaration(items: Array<{
    title: string;
    quantity: number;
    value: number;
    weight: number;
    hsCode?: string;
    originCountry: string;
  }>): string {
    // Generate CN22/CN23 customs form data
    const declaration = {
      items: items.map(item => ({
        description: item.title,
        quantity: item.quantity,
        value: item.value,
        weight: item.weight,
        hsCode: item.hsCode || '9999.99.99', // Harmonized System code
        origin: item.originCountry
      })),
      totalValue: items.reduce((sum, item) => sum + (item.value * item.quantity), 0),
      totalWeight: items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
    };

    return JSON.stringify(declaration);
  }
}

// Singleton instance
export const internationalShipping = new InternationalShippingManager();

// React Hook
export function useInternationalShipping() {
  return {
    getSupportedCountries: internationalShipping.getSupportedCountries.bind(internationalShipping),
    getShippingRates: internationalShipping.getShippingRates.bind(internationalShipping),
    calculateCustoms: internationalShipping.calculateCustoms.bind(internationalShipping),
    convertCurrency: internationalShipping.convertCurrency.bind(internationalShipping),
    validateAddress: internationalShipping.validateAddress.bind(internationalShipping)
  };
}

