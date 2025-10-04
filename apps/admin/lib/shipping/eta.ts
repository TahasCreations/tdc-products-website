import { addDays, addBusinessDays, isWeekend, format, parseISO, isAfter, isBefore, isSameDay, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  ShippingEstimateConfig, 
  RegionCode, 
  Carrier, 
  SlaRule, 
  Warehouse,
  defaultRegionETAs 
} from '../../schemas/shippingEstimate';

export interface ETAEstimate {
  minDays: number;
  maxDays: number;
  minDate: Date;
  maxDate: Date;
  formattedRange: string;
  carrier?: Carrier;
  note?: string;
  transitMin?: number;
  transitMax?: number;
  warehouse?: string;
}

export interface ETAPreview {
  customerMessage: string;
  shippingDate: string;
  deliveryDate: string;
  pdpLabel: string;
  cartLabel: string;
  checkoutLabel: string;
  cutoffCountdown?: string;
  isAfterCutoff?: boolean;
}

export interface MultiWarehousePlan {
  packages: {
    warehouse: Warehouse;
    items: { productId: string; variantId?: string; quantity: number }[];
    eta: ETAEstimate;
  }[];
  totalPackages: number;
  estimatedDeliveryRange: string;
}

export interface DeliveryWindow {
  shipMin: Date;
  shipMax: Date;
  deliveryMin: Date;
  deliveryMax: Date;
  leadTimeMin: number;
  leadTimeMax: number;
  transitMin: number;
  transitMax: number;
}

/**
 * İş günü hesaplama fonksiyonu
 */
export function calculateBusinessDays(startDate: Date, days: number, includeWeekends: boolean = false): Date {
  if (includeWeekends) {
    return addDays(startDate, days);
  }
  return addBusinessDays(startDate, days);
}

/**
 * Blackout günlerini kontrol eder ve gerekirse tarihi ileri alır
 */
export function adjustForBlackoutDates(date: Date, blackoutDates: string[]): Date {
  let adjustedDate = new Date(date);
  const blackoutSet = new Set(blackoutDates.map(d => d.split('T')[0])); // ISO tarih formatından sadece tarih kısmını al
  
  while (blackoutSet.has(format(adjustedDate, 'yyyy-MM-dd'))) {
    adjustedDate = addDays(adjustedDate, 1);
  }
  
  return adjustedDate;
}

/**
 * Cutoff saatini kontrol eder
 */
export function isAfterCutoff(date: Date, cutoffHour: number): boolean {
  return date.getHours() >= cutoffHour;
}

/**
 * Cutoff saatini kontrol eder (isAfterCutoff alias)
 */
export function isAfterCutoffTime(date: Date, cutoffHour: number): boolean {
  return isAfterCutoff(date, cutoffHour);
}

/**
 * Bölgeye göre override ayarlarını bulur
 */
export function findRegionOverride(config: ShippingEstimateConfig, region: RegionCode) {
  return config.regionOverrides?.find(override => override.region === region);
}

/**
 * Temel ETA hesaplama
 */
export function calculateBaseETA(
  config: ShippingEstimateConfig,
  orderDate: Date = new Date(),
  region: RegionCode = "TR-Domestic"
): ETAEstimate {
  const regionOverride = findRegionOverride(config, region);
  
  let minDays: number;
  let maxDays: number;
  let carrier: string | undefined;
  let note: string | undefined;

  // Bölge override varsa onu kullan
  if (regionOverride) {
    if (regionOverride.mode === "sabit" && regionOverride.fixedDays !== undefined) {
      minDays = maxDays = regionOverride.fixedDays;
    } else if (regionOverride.mode === "aralik" && regionOverride.minDays !== undefined && regionOverride.maxDays !== undefined) {
      minDays = regionOverride.minDays;
      maxDays = regionOverride.maxDays;
    } else {
      // Fallback to base config
      minDays = config.fixedDays || 1;
      maxDays = config.minDays || config.maxDays || 1;
    }
    carrier = regionOverride.carrier;
    note = regionOverride.note;
  } else {
    // Temel konfigürasyonu kullan
    if (config.estimateMode === "sabit" && config.fixedDays !== undefined) {
      minDays = maxDays = config.fixedDays;
    } else if (config.estimateMode === "aralik" && config.minDays !== undefined && config.maxDays !== undefined) {
      minDays = config.minDays;
      maxDays = config.maxDays;
    } else if (config.estimateMode === "kural" && config.dailyCapacity && config.backlogUnits !== undefined) {
      // Kural bazlı hesaplama (el yapımı ürünler için)
      const totalUnits = config.backlogUnits + 1; // +1 mevcut sipariş
      const productionDays = Math.ceil(totalUnits / config.dailyCapacity);
      const capacityFactor = config.capacityFactor || 1.0;
      minDays = Math.ceil(productionDays * capacityFactor);
      maxDays = Math.ceil(productionDays * capacityFactor * 1.2); // %20 buffer
    } else {
      minDays = maxDays = 1; // Fallback
    }
  }

  // Cutoff kontrolü
  let startDate = new Date(orderDate);
  if (isAfterCutoff(startDate, config.cutoffHour)) {
    startDate = addDays(startDate, 1);
  }

  // Blackout günlerini uygula
  if (config.blackoutDates && config.blackoutDates.length > 0) {
    startDate = adjustForBlackoutDates(startDate, config.blackoutDates);
  }

  // İş günü hesaplama
  const minDate = calculateBusinessDays(startDate, minDays, !config.businessDays);
  const maxDate = calculateBusinessDays(startDate, maxDays, !config.businessDays);

  // Hafta sonu sevkiyat kontrolü
  if (!config.weekendDispatch) {
    if (isWeekend(minDate)) {
      const nextMonday = addDays(minDate, 8 - minDate.getDay());
      minDate.setTime(nextMonday.getTime());
    }
    if (isWeekend(maxDate)) {
      const nextMonday = addDays(maxDate, 8 - maxDate.getDay());
      maxDate.setTime(nextMonday.getTime());
    }
  }

  // Blackout günlerini son kez kontrol et
  const finalMinDate = config.blackoutDates ? adjustForBlackoutDates(minDate, config.blackoutDates) : minDate;
  const finalMaxDate = config.blackoutDates ? adjustForBlackoutDates(maxDate, config.blackoutDates) : maxDate;

  const formattedRange = formatDateRange(finalMinDate, finalMaxDate, config.businessDays);

  return {
    minDays,
    maxDays,
    minDate: finalMinDate,
    maxDate: finalMaxDate,
    formattedRange,
    carrier,
    note
  };
}

/**
 * Tarih aralığını formatlar
 */
export function formatDateRange(minDate: Date, maxDate: Date, businessDays: boolean): string {
  const isSame = isSameDay(minDate, maxDate);
  
  if (isSame) {
    return format(minDate, 'dd MMMM yyyy', { locale: tr });
  }
  
  const minFormatted = format(minDate, 'dd MMMM', { locale: tr });
  const maxFormatted = format(maxDate, 'dd MMMM yyyy', { locale: tr });
  
  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Müşteri için ETA önizlemesi oluşturur
 */
export function generateETAPreview(
  config: ShippingEstimateConfig,
  orderDate: Date = new Date(),
  region: RegionCode = "TR-Domestic"
): ETAPreview {
  const eta = calculateBaseETA(config, orderDate, region);
  
  const dayType = config.businessDays ? 'iş günü' : 'gün';
  const productionType = config.productionType === 'stoklu' ? 'hazır' : 'el yapımı';
  
  // Müşteri mesajı
  let customerMessage: string;
  if (eta.minDays === eta.maxDays) {
    customerMessage = `${eta.minDays} ${dayType} içinde kargoda`;
  } else {
    customerMessage = `${eta.minDays}-${eta.maxDays} ${dayType} içinde kargoda`;
  }
  
  if (config.productionType === 'elyapimi') {
    customerMessage = `El yapımı ürün: ${customerMessage}`;
  }
  
  if (eta.carrier) {
    customerMessage += ` (${eta.carrier})`;
  }
  
  // Kargo tarihi
  const shippingDate = format(eta.minDate, 'dd MMMM yyyy', { locale: tr });
  
  // Teslimat tarihi (kargo + 1-3 gün)
  const deliveryMin = addDays(eta.minDate, 1);
  const deliveryMax = addDays(eta.maxDate, 3);
  const deliveryDate = formatDateRange(deliveryMin, deliveryMax, config.businessDays);
  
  // UI etiketleri
  const pdpLabel = `Tahmini Teslimat: ${eta.formattedRange}`;
  const cartLabel = `Kargo: ${customerMessage}`;
  const checkoutLabel = `Teslimat: ${deliveryDate}`;
  
  return {
    customerMessage,
    shippingDate,
    deliveryDate,
    pdpLabel,
    cartLabel,
    checkoutLabel
  };
}

/**
 * JSON-LD structured data oluşturur
 */
export function generateShippingStructuredData(eta: ETAEstimate, productName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": productName,
    "availability": "https://schema.org/InStock",
    "deliveryLeadTime": {
      "@type": "QuantitativeValue",
      "minValue": eta.minDays,
      "maxValue": eta.maxDays,
      "unitCode": "DAY"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "deliveryTime": {
        "@type": "QuantitativeValue",
        "minValue": eta.minDays,
        "maxValue": eta.maxDays,
        "unitCode": "DAY"
      }
    }
  };
}

/**
 * Bölgeye göre varsayılan kargo süreleri
 */
export const defaultRegionETAs: Record<RegionCode, { min: number; max: number; carrier: Carrier }> = {
  "TR-Domestic": { min: 1, max: 2, carrier: "Yurtiçi" },
  "EU": { min: 3, max: 7, carrier: "DHL" },
  "MENA": { min: 5, max: 10, carrier: "DHL" },
  "US": { min: 7, max: 14, carrier: "UPS" },
  "Other": { min: 10, max: 21, carrier: "DHL" }
};

/**
 * SLA kurallarından transit süresini bulur
 */
export function resolveSla(
  scope: { postalPattern?: string; il?: string; ilce?: string; region?: RegionCode },
  carrier?: Carrier,
  slaRules: SlaRule[] = []
): { transitMin: number; transitMax: number; carrier: Carrier } {
  // Önce spesifik kuralları ara (postal pattern > ilçe > il > bölge)
  let bestRule: SlaRule | null = null;
  let bestScore = 0;

  for (const rule of slaRules) {
    if (rule.carrier !== carrier && carrier !== undefined) continue;
    
    let score = 0;
    if (scope.postalPattern && rule.scope.postalPattern) {
      if (scope.postalPattern.includes(rule.scope.postalPattern)) score = 100;
    } else if (scope.ilce && rule.scope.ilce) {
      if (scope.ilce === rule.scope.ilce) score = 80;
    } else if (scope.il && rule.scope.il) {
      if (scope.il === rule.scope.il) score = 60;
    } else if (scope.region && rule.scope.region) {
      if (scope.region === rule.scope.region) score = 40;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (bestRule) {
    return {
      transitMin: bestRule.transitMin,
      transitMax: bestRule.transitMax,
      carrier: bestRule.carrier
    };
  }

  // Varsayılan bölge ayarlarını kullan
  const region = scope.region || "TR-Domestic";
  const defaultSla = defaultRegionETAs[region];
  return {
    transitMin: defaultSla.min,
    transitMax: defaultSla.max,
    carrier: defaultSla.carrier
  };
}

/**
 * Çok depo için sipariş tahsisi yapar
 */
export function multiWarehousePlan(
  items: { productId: string; variantId?: string; quantity: number }[],
  warehouses: Warehouse[],
  config: ShippingEstimateConfig,
  slaRules: SlaRule[] = []
): MultiWarehousePlan {
  const packages: MultiWarehousePlan['packages'] = [];
  let totalPackages = 0;

  for (const item of items) {
    // En yakın/uygun depoyu bul (şimdilik basit round-robin)
    const warehouse = warehouses[totalPackages % warehouses.length];
    
    // Bu depo için ETA hesapla
    const eta = calculateBaseETA(config, new Date(), "TR-Domestic");
    
    packages.push({
      warehouse,
      items: [item],
      eta: {
        ...eta,
        warehouse: warehouse.name
      }
    });
    
    totalPackages++;
  }

  // Genel teslimat aralığını hesapla
  const allMinDates = packages.map(p => p.eta.minDate);
  const allMaxDates = packages.map(p => p.eta.maxDate);
  const deliveryMin = new Date(Math.min(...allMinDates.map(d => d.getTime())));
  const deliveryMax = new Date(Math.max(...allMaxDates.map(d => d.getTime())));
  
  const estimatedDeliveryRange = formatDateRange(deliveryMin, deliveryMax, config.businessDays);

  return {
    packages,
    totalPackages,
    estimatedDeliveryRange
  };
}

/**
 * Cutoff sayaç hesaplama
 */
export function calculateCutoffCountdown(cutoffHour: number): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cutoffHour, 0, 0);
  
  if (now >= today) {
    // Cutoff geçmiş, yarınki cutoff'a kadar say
    const tomorrow = addDays(today, 1);
    const diff = tomorrow.getTime() - now.getTime();
    return formatTimeRemaining(diff);
  } else {
    // Bugünkü cutoff'a kadar say
    const diff = today.getTime() - now.getTime();
    return formatTimeRemaining(diff);
  }
}

/**
 * Zaman kalanını formatlar
 */
function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Gelişmiş ETA hesaplama (transit dahil)
 */
export function calculateAdvancedETA(
  config: ShippingEstimateConfig,
  orderDate: Date = new Date(),
  region: RegionCode = "TR-Domestic",
  carrier?: Carrier,
  slaRules: SlaRule[] = []
): ETAEstimate {
  // Temel lead time hesapla
  const baseEta = calculateBaseETA(config, orderDate, region);
  
  // Transit süresini al
  const sla = resolveSla({ region }, carrier, slaRules);
  
  // Transit süresini ekle
  const transitMin = sla.transitMin;
  const transitMax = sla.transitMax;
  
  const finalMinDate = addDays(baseEta.minDate, transitMin);
  const finalMaxDate = addDays(baseEta.maxDate, transitMax);
  
  const formattedRange = formatDateRange(finalMinDate, finalMaxDate, config.businessDays);
  
  return {
    ...baseEta,
    minDate: finalMinDate,
    maxDate: finalMaxDate,
    formattedRange,
    carrier: carrier || sla.carrier,
    transitMin,
    transitMax
  };
}

/**
 * Gelişmiş müşteri önizlemesi
 */
export function generateAdvancedETAPreview(
  config: ShippingEstimateConfig,
  orderDate: Date = new Date(),
  region: RegionCode = "TR-Domestic",
  carrier?: Carrier,
  slaRules: SlaRule[] = []
): ETAPreview {
  const eta = calculateAdvancedETA(config, orderDate, region, carrier, slaRules);
  const cutoffCountdown = calculateCutoffCountdown(config.cutoffHour);
  const isAfterCutoff = isAfterCutoffTime(orderDate, config.cutoffHour);
  
  const dayType = config.businessDays ? 'iş günü' : 'gün';
  const productionType = config.productionType === 'stoklu' ? 'hazır' : 'el yapımı';
  
  // Müşteri mesajı
  let customerMessage: string;
  if (eta.minDays === eta.maxDays) {
    customerMessage = `${eta.minDays} ${dayType} içinde kargoda`;
  } else {
    customerMessage = `${eta.minDays}-${eta.maxDays} ${dayType} içinde kargoda`;
  }
  
  if (config.productionType === 'elyapimi') {
    customerMessage = `El yapımı ürün: ${customerMessage}`;
  }
  
  if (eta.carrier) {
    customerMessage += ` (${eta.carrier})`;
  }
  
  // Kargo tarihi
  const shippingDate = format(eta.minDate, 'dd MMMM yyyy', { locale: tr });
  
  // Teslimat tarihi
  const deliveryDate = eta.formattedRange;
  
  // UI etiketleri
  const pdpLabel = `Tahmini Teslimat: ${deliveryDate}`;
  const cartLabel = `Kargo: ${customerMessage}`;
  const checkoutLabel = `Teslimat: ${deliveryDate}`;
  
  return {
    customerMessage,
    shippingDate,
    deliveryDate,
    pdpLabel,
    cartLabel,
    checkoutLabel,
    cutoffCountdown,
    isAfterCutoff
  };
}

/**
 * JSON-LD structured data oluşturur (gelişmiş)
 */
export function generateAdvancedShippingStructuredData(
  eta: ETAEstimate, 
  productName: string,
  config: ShippingEstimateConfig
) {
  const handlingTime = {
    "@type": "QuantitativeValue",
    "minValue": eta.minDays - (eta.transitMin || 0),
    "maxValue": eta.maxDays - (eta.transitMax || 0),
    "unitCode": "DAY"
  };

  const transitTime = eta.transitMin && eta.transitMax ? {
    "@type": "QuantitativeValue",
    "minValue": eta.transitMin,
    "maxValue": eta.transitMax,
    "unitCode": "DAY"
  } : undefined;

  const deliveryTime = {
    "@type": "QuantitativeValue",
    "minValue": eta.minDays,
    "maxValue": eta.maxDays,
    "unitCode": "DAY"
  };

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": productName,
    "availability": "https://schema.org/InStock",
    "deliveryLeadTime": deliveryTime,
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "deliveryTime": deliveryTime,
      "handlingTime": handlingTime,
      ...(transitTime && { "transitTime": transitTime }),
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "TR"
      }
    }
  };
}
