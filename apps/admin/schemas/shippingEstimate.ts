import { z } from 'zod';

export type RegionCode = "TR-Domestic" | "EU" | "MENA" | "US" | "Other";
export type Carrier = "Yurtiçi" | "Aras" | "UPS" | "DHL" | "FedEx" | "PTT" | "MNG" | "Sürat" | "Other";

export const regionCodeSchema = z.enum(["TR-Domestic", "EU", "MENA", "US", "Other"]);
export const carrierSchema = z.enum(["Yurtiçi", "Aras", "UPS", "DHL", "FedEx", "PTT", "MNG", "Sürat", "Other"]);

export const regionOverrideSchema = z.object({
  region: regionCodeSchema,
  mode: z.enum(["sabit", "aralik"]).optional(),
  fixedDays: z.number().min(0).optional(),
  minDays: z.number().min(0).optional(),
  maxDays: z.number().min(0).optional(),
  carrier: carrierSchema.optional(),
  note: z.string().max(200).optional(),
}).refine((data) => {
  if (data.mode === "sabit") {
    return data.fixedDays !== undefined;
  }
  if (data.mode === "aralik") {
    return data.minDays !== undefined && data.maxDays !== undefined && data.maxDays >= data.minDays;
  }
  return true;
}, {
  message: "Bölge ayarları tutarlı olmalı: sabit mod için fixedDays, aralık mod için minDays ve maxDays gerekli"
});

export const shippingEstimateConfigSchema = z.object({
  productionType: z.enum(["stoklu", "elyapimi"]),
  estimateMode: z.enum(["sabit", "aralik", "kural"]),
  businessDays: z.boolean(),
  weekendDispatch: z.boolean(),
  cutoffHour: z.number().min(0).max(23),
  fixedDays: z.number().min(0).optional(),
  minDays: z.number().min(0).optional(),
  maxDays: z.number().min(0).optional(),
  regionOverrides: z.array(regionOverrideSchema).optional(),
  blackoutDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  capacityFactor: z.number().min(0.5).max(2.0).optional(),
  dailyCapacity: z.number().min(0).optional(),
  backlogUnits: z.number().min(0).optional(),
}).refine((data) => {
  if (data.estimateMode === "sabit") {
    return data.fixedDays !== undefined;
  }
  if (data.estimateMode === "aralik") {
    return data.minDays !== undefined && data.maxDays !== undefined && data.maxDays >= data.minDays;
  }
  return true;
}, {
  message: "Tahmin modu ayarları tutarlı olmalı"
}).refine((data) => {
  if (data.productionType === "elyapimi" && data.estimateMode === "kural") {
    return data.dailyCapacity !== undefined && data.backlogUnits !== undefined;
  }
  return true;
}, {
  message: "El yapımı ürünler için kural modunda günlük kapasite ve bekleyen sipariş gerekli"
});

// SLA Matrix Schema
export const slaRuleSchema = z.object({
  scope: z.object({
    postalPattern: z.string().optional(),
    il: z.string().optional(),
    ilce: z.string().optional(),
    region: regionCodeSchema.optional(),
  }),
  carrier: carrierSchema,
  transitMin: z.number().min(0),
  transitMax: z.number().min(0),
  remoteAreaFactor: z.number().min(1.0).max(3.0).optional(),
}).refine((data) => data.transitMax >= data.transitMin, {
  message: "Transit maksimum, minimumdan büyük veya eşit olmalı"
});

// Warehouse Schema
export const warehouseSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  lat: z.number(),
  lon: z.number(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  cutoffHour: z.number().min(0).max(23).default(16),
  weekendDispatch: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Holiday Schema
export const holidaySchema = z.object({
  name: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["resmi", "özel", "kampanya"]),
  isRecurring: z.boolean().default(false),
  capacityFactor: z.number().min(0.1).max(3.0).default(1.0),
  description: z.string().optional(),
});

// Shipping Preset Schema
export const shippingPresetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  productionType: z.enum(["stoklu", "elyapimi"]),
  estimateMode: z.enum(["sabit", "aralik", "kural"]),
  businessDays: z.boolean().default(true),
  weekendDispatch: z.boolean().default(false),
  cutoffHour: z.number().min(0).max(23).default(16),
  fixedDays: z.number().min(0).optional(),
  minDays: z.number().min(0).optional(),
  maxDays: z.number().min(0).optional(),
  capacityFactor: z.number().min(0.5).max(2.0).optional(),
  dailyCapacity: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

// Product Variant Schema
export const productVariantSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  attributes: z.record(z.any()),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).default(0),
  images: z.array(z.string()).optional(),
  shippingEstimateVariant: z.enum(["inherit", "override"]).default("inherit"),
  shippingEstimate: shippingEstimateConfigSchema.optional(),
  isActive: z.boolean().default(true),
});

export type RegionOverride = z.infer<typeof regionOverrideSchema>;
export type ShippingEstimateConfig = z.infer<typeof shippingEstimateConfigSchema>;
export type SlaRule = z.infer<typeof slaRuleSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type Holiday = z.infer<typeof holidaySchema>;
export type ShippingPreset = z.infer<typeof shippingPresetSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;

// Bölge etiketleri
export const regionLabels: Record<RegionCode, string> = {
  "TR-Domestic": "Türkiye İçi",
  "EU": "Avrupa Birliği",
  "MENA": "Orta Doğu & Kuzey Afrika",
  "US": "Amerika Birleşik Devletleri",
  "Other": "Diğer Ülkeler"
};

// Taşıyıcı seçenekleri
export const carrierOptions = [
  { value: "Yurtiçi", label: "Yurtiçi Kargo" },
  { value: "Aras", label: "Aras Kargo" },
  { value: "UPS", label: "UPS" },
  { value: "DHL", label: "DHL" },
  { value: "FedEx", label: "FedEx" },
  { value: "PTT", label: "PTT Kargo" },
  { value: "MNG", label: "MNG Kargo" },
  { value: "Sürat", label: "Sürat Kargo" },
  { value: "Other", label: "Diğer" }
];

// Tatil türleri
export const holidayTypes = [
  { value: "resmi", label: "Resmi Tatil" },
  { value: "özel", label: "Özel Gün" },
  { value: "kampanya", label: "Kampanya Günü" }
];

// Varsayılan konfigürasyon
export const defaultShippingConfig: ShippingEstimateConfig = {
  productionType: "stoklu",
  estimateMode: "sabit",
  businessDays: true,
  weekendDispatch: false,
  cutoffHour: 16,
  fixedDays: 1,
  regionOverrides: [],
  blackoutDates: [],
  capacityFactor: 1.0
};

// Varsayılan preset'ler
export const defaultPresets: ShippingPreset[] = [
  {
    name: "Resin-1:6",
    description: "Resin figürler için hızlı üretim",
    productionType: "elyapimi",
    estimateMode: "sabit",
    businessDays: true,
    weekendDispatch: false,
    cutoffHour: 16,
    fixedDays: 6,
    capacityFactor: 1.0,
    dailyCapacity: 5,
    isActive: true,
  },
  {
    name: "PLA-1:10",
    description: "PLA 3D baskı ürünleri",
    productionType: "elyapimi",
    estimateMode: "aralik",
    businessDays: true,
    weekendDispatch: false,
    cutoffHour: 16,
    minDays: 8,
    maxDays: 10,
    capacityFactor: 1.2,
    dailyCapacity: 3,
    isActive: true,
  },
  {
    name: "Hediyelik-Hızlı",
    description: "Hediye ürünleri hızlı teslimat",
    productionType: "stoklu",
    estimateMode: "sabit",
    businessDays: true,
    weekendDispatch: true,
    cutoffHour: 18,
    fixedDays: 1,
    capacityFactor: 1.0,
    isActive: true,
  }
];
