import { CacheService } from '@/lib/cache/redis';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate to base currency
  isBase: boolean;
}

export class MultiCurrencySystem {
  private static baseCurrency = 'USD';
  private static currencies: Currency[] = [];

  /**
   * Initialize currencies
   */
  static async initialize(): Promise<void> {
    // Load currencies from cache or API
    const cached = await CacheService.get<Currency[]>('currencies');
    
    if (cached) {
      this.currencies = cached;
    } else {
      await this.fetchExchangeRates();
    }
  }

  /**
   * Fetch exchange rates from API
   */
  static async fetchExchangeRates(): Promise<void> {
    try {
      // Fetch from exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      this.currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, isBase: true },
        { code: 'EUR', name: 'Euro', symbol: '€', rate: data.rates.EUR, isBase: false },
        { code: 'GBP', name: 'British Pound', symbol: '£', rate: data.rates.GBP, isBase: false },
        { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: data.rates.TRY, isBase: false },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: data.rates.JPY, isBase: false },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: data.rates.CAD, isBase: false },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: data.rates.AUD, isBase: false },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: data.rates.CHF, isBase: false },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: data.rates.CNY, isBase: false },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: data.rates.INR, isBase: false },
      ];
      
      // Cache for 1 hour
      await CacheService.set('currencies', this.currencies, { ttl: 3600 });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Use default rates
      this.currencies = this.getDefaultCurrencies();
    }
  }

  /**
   * Get default currencies
   */
  static getDefaultCurrencies(): Currency[] {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, isBase: true },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, isBase: false },
      { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, isBase: false },
      { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 30.0, isBase: false },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110, isBase: false },
    ];
  }

  /**
   * Get all currencies
   */
  static getCurrencies(): Currency[] {
    return this.currencies;
  }

  /**
   * Get currency by code
   */
  static getCurrency(code: string): Currency | undefined {
    return this.currencies.find(c => c.code === code);
  }

  /**
   * Convert amount between currencies
   */
  static convert(amount: number, fromCurrency: string, toCurrency: string): number {
    const from = this.getCurrency(fromCurrency);
    const to = this.getCurrency(toCurrency);
    
    if (!from || !to) return amount;
    
    // Convert to base currency first
    const baseAmount = amount / from.rate;
    
    // Convert to target currency
    return baseAmount * to.rate;
  }

  /**
   * Format price in currency
   */
  static format(amount: number, currencyCode: string, decimals: number = 2): string {
    const currency = this.getCurrency(currencyCode);
    if (!currency) return amount.toFixed(decimals);
    
    const converted = this.convert(amount, this.baseCurrency, currencyCode);
    
    // Format based on currency
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${currency.symbol}${converted.toFixed(decimals).toLocaleString()}`;
  }

  /**
   * Detect user currency based on location
   */
  static async detectUserCurrency(): Promise<string> {
    try {
      // Use IP geolocation to detect currency
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const currencyMap: Record<string, string> = {
        'US': 'USD',
        'GB': 'GBP',
        'TR': 'TRY',
        'JP': 'JPY',
        'EU': 'EUR',
      };
      
      return currencyMap[data.country_code] || 'USD';
    } catch (error) {
      console.error('Failed to detect currency:', error);
      return 'USD';
    }
  }

  /**
   * Save user currency preference
   */
  static async saveUserPreference(userId: string, currencyCode: string): Promise<void> {
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { preferredCurrency: currencyCode }
    // });
  }

  /**
   * Get user currency preference
   */
  static async getUserPreference(userId: string): Promise<string> {
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { preferredCurrency: true }
    // });
    
    // return user?.preferredCurrency || 'USD';
    return 'USD';
  }
}

