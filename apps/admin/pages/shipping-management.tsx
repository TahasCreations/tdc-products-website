'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Truck,
  Package,
  MapPin,
  Calendar,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';

import { ShippingEstimatePlugin } from '../components/product/ShippingEstimatePlugin';
import { VariantEtaEditor } from '../components/product/VariantEtaEditor';
import { SlaMatrixEditor } from '../components/shipping/SlaMatrixEditor';
import { WarehouseRulesEditor } from '../components/warehouse/WarehouseRulesEditor';
import { HolidayCalendar } from '../components/shipping/HolidayCalendar';
import { 
  ShippingEstimateConfig, 
  ProductVariant,
  SlaRule,
  Warehouse,
  Holiday,
  defaultShippingConfig,
  defaultPresets
} from '../schemas/shippingEstimate';

export default function ShippingManagementPage() {
  const [shippingConfig, setShippingConfig] = useState<ShippingEstimateConfig>(defaultShippingConfig);
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      sku: 'FIG-001-RED',
      name: 'Naruto Figür - Kırmızı',
      attributes: { color: 'red', size: 'medium' },
      price: 299.99,
      stock: 10,
      shippingEstimateVariant: 'inherit',
      isActive: true
    },
    {
      sku: 'FIG-001-BLUE',
      name: 'Naruto Figür - Mavi',
      attributes: { color: 'blue', size: 'medium' },
      price: 299.99,
      stock: 5,
      shippingEstimateVariant: 'override',
      shippingEstimate: {
        productionType: 'elyapimi',
        estimateMode: 'aralik',
        businessDays: true,
        weekendDispatch: false,
        cutoffHour: 16,
        minDays: 5,
        maxDays: 8,
        capacityFactor: 1.2
      },
      isActive: true
    }
  ]);
  const [slaRules, setSlaRules] = useState<SlaRule[]>([
    {
      scope: { region: 'TR-Domestic' },
      carrier: 'Yurtiçi',
      transitMin: 1,
      transitMax: 2,
      remoteAreaFactor: 1.0
    },
    {
      scope: { region: 'EU' },
      carrier: 'DHL',
      transitMin: 3,
      transitMax: 7,
      remoteAreaFactor: 1.2
    }
  ]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      name: 'İstanbul Merkez Depo',
      code: 'IST-01',
      lat: 41.0082,
      lon: 28.9784,
      address: 'Merkez Mahallesi, Depo Sokak No:1',
      city: 'İstanbul',
      postalCode: '34000',
      cutoffHour: 16,
      weekendDispatch: false,
      isActive: true
    },
    {
      name: 'Ankara Depo',
      code: 'ANK-01',
      lat: 39.9334,
      lon: 32.8597,
      address: 'Çankaya Mahallesi, Depo Caddesi No:5',
      city: 'Ankara',
      postalCode: '06100',
      cutoffHour: 15,
      weekendDispatch: true,
      isActive: true
    }
  ]);
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      name: 'Yılbaşı',
      date: '2024-01-01',
      type: 'resmi',
      isRecurring: true,
      capacityFactor: 1.0,
      description: 'Yeni Yıl Tatili'
    },
    {
      name: 'Black Friday',
      date: '2024-11-29',
      type: 'kampanya',
      isRecurring: false,
      capacityFactor: 2.0,
      description: 'Yoğun kampanya günü'
    }
  ]);

  const handleVariantsChange = (newVariants: ProductVariant[]) => {
    setVariants(newVariants);
  };

  const handleSlaRulesChange = (newRules: SlaRule[]) => {
    setSlaRules(newRules);
  };

  const handleWarehousesChange = (newWarehouses: Warehouse[]) => {
    setWarehouses(newWarehouses);
  };

  const handleHolidaysChange = (newHolidays: Holiday[]) => {
    setHolidays(newHolidays);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TDC Market - Kargo & ETA Yönetim Sistemi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kapsamlı kargo süresi yönetimi, çok depo sistemi, SLA matrisi ve tatil takvimi ile 
              müşterilere doğru teslimat bilgileri sunun.
            </p>
          </motion.div>
        </div>

        {/* Ana İçerik */}
        <Tabs defaultValue="shipping" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Kargo Ayarları
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Varyant ETA
            </TabsTrigger>
            <TabsTrigger value="sla" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              SLA Matrisi
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Depo Yönetimi
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tatil Takvimi
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analitik
            </TabsTrigger>
          </TabsList>

          {/* Kargo Ayarları */}
          <TabsContent value="shipping">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ShippingEstimatePlugin
                initialConfig={shippingConfig}
                onConfigChange={setShippingConfig}
                productName="Demo Ürün"
              />
            </motion.div>
          </TabsContent>

          {/* Varyant ETA */}
          <TabsContent value="variants">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <VariantEtaEditor
                variants={variants}
                onVariantsChange={handleVariantsChange}
                productName="Demo Ürün"
              />
            </motion.div>
          </TabsContent>

          {/* SLA Matrisi */}
          <TabsContent value="sla">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SlaMatrixEditor
                initialRules={slaRules}
                onRulesChange={handleSlaRulesChange}
              />
            </motion.div>
          </TabsContent>

          {/* Depo Yönetimi */}
          <TabsContent value="warehouses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <WarehouseRulesEditor
                initialWarehouses={warehouses}
                onWarehousesChange={handleWarehousesChange}
              />
            </motion.div>
          </TabsContent>

          {/* Tatil Takvimi */}
          <TabsContent value="holidays">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HolidayCalendar
                initialHolidays={holidays}
                onHolidaysChange={handleHolidaysChange}
              />
            </motion.div>
          </TabsContent>

          {/* Analitik */}
          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Sistem Durumu
                    </CardTitle>
                    <CardDescription>
                      Kargo sistemi genel durumu ve istatistikleri
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Aktif Depo Sayısı</span>
                        <span className="font-semibold">{warehouses.filter(w => w.isActive).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">SLA Kural Sayısı</span>
                        <span className="font-semibold">{slaRules.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tatil Sayısı</span>
                        <span className="font-semibold">{holidays.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Varyant Sayısı</span>
                        <span className="font-semibold">{variants.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Hızlı İşlemler
                    </CardTitle>
                    <CardDescription>
                      Sistem yönetimi için hızlı erişim
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium">SLA Matrisini Dışa Aktar</div>
                        <div className="text-sm text-gray-500">CSV formatında indir</div>
                      </button>
                      <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium">Tatil Takvimini Senkronize Et</div>
                        <div className="text-sm text-gray-500">Türk resmi tatilleri</div>
                      </button>
                      <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium">Çok Depo Testi Çalıştır</div>
                        <div className="text-sm text-gray-500">Sipariş tahsisi simülasyonu</div>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Alt Bilgi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                TDC Market Kargo Yönetim Sistemi v2.0
              </h3>
              <p className="text-gray-600 mb-4">
                Gelişmiş kargo süresi yönetimi, çok depo sistemi ve akıllı ETA hesaplama
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>✓ Varyant bazlı ETA</span>
                <span>✓ SLA matris yönetimi</span>
                <span>✓ Çok depo sistemi</span>
                <span>✓ Tatil takvimi</span>
                <span>✓ Preset yönetimi</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
