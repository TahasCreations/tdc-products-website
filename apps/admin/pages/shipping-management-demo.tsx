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
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Package, 
  Settings, 
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  Save,
  Eye
} from 'lucide-react';

// Bileşenleri import et
import { ShippingEstimatePlugin } from '../components/product/ShippingEstimatePlugin';
import { VariantEtaEditor } from '../components/product/VariantEtaEditor';
import { SlaMatrixEditor } from '../components/shipping/SlaMatrixEditor';
import { WarehouseRulesEditor } from '../components/warehouse/WarehouseRulesEditor';
import { HolidayCalendar } from '../components/shipping/HolidayCalendar';
import { PresetsBulkEditor } from '../components/shipping/PresetsBulkEditor';
import { DeliveryAnalytics } from '../components/shipping/DeliveryAnalytics';

import { 
  ShippingEstimateConfig, 
  ProductVariant, 
  SlaRule, 
  Warehouse, 
  Holiday, 
  ShippingPreset,
  defaultShippingConfig,
  defaultPresets
} from '../schemas/shippingEstimate';

export default function ShippingManagementDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [shippingConfig, setShippingConfig] = useState<ShippingEstimateConfig>(defaultShippingConfig);
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: '1',
      sku: 'FIG-001-RED',
      name: 'Anime Figür - Kırmızı',
      price: 299.99,
      stock: 15,
      shippingEstimateVariant: 'inherit'
    },
    {
      id: '2',
      sku: 'FIG-001-BLUE',
      name: 'Anime Figür - Mavi',
      price: 299.99,
      stock: 8,
      shippingEstimateVariant: 'override',
      shippingEstimate: {
        productionType: 'elyapimi',
        estimateMode: 'sabit',
        businessDays: true,
        weekendDispatch: false,
        cutoffHour: 14,
        fixedDays: 3,
        minDays: undefined,
        maxDays: undefined,
        dailyCapacity: undefined,
        backlogUnits: undefined,
        capacityFactor: undefined,
        regionOverrides: [],
        blackoutDates: []
      }
    }
  ]);
  const [slaRules, setSlaRules] = useState<SlaRule[]>([
    {
      id: '1',
      region: 'TR-Domestic',
      postalPattern: '*',
      carrier: 'aras-kargo',
      minDays: 1,
      maxDays: 3,
      priority: 1,
      isActive: true
    },
    {
      id: '2',
      region: 'TR-International',
      postalPattern: '*',
      carrier: 'dhl',
      minDays: 3,
      maxDays: 7,
      priority: 2,
      isActive: true
    }
  ]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'İstanbul Ana Depo',
      code: 'IST-001',
      address: 'Maslak, İstanbul',
      cutoffHour: 16,
      weekendDispatch: false,
      isActive: true
    },
    {
      id: '2',
      name: 'Ankara Depo',
      code: 'ANK-001',
      address: 'Çankaya, Ankara',
      cutoffHour: 15,
      weekendDispatch: true,
      isActive: true
    }
  ]);
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      name: 'Yeni Yıl',
      date: '2024-01-01',
      type: 'public',
      capacityFactor: 0,
      isActive: true
    },
    {
      id: '2',
      name: 'Kurban Bayramı',
      date: '2024-06-16',
      type: 'public',
      capacityFactor: 0,
      isActive: true
    }
  ]);
  const [presets, setPresets] = useState<ShippingPreset[]>(defaultPresets);

  const handleSaveAll = () => {
    console.log('Tüm ayarlar kaydediliyor...', {
      shippingConfig,
      variants,
      slaRules,
      warehouses,
      holidays,
      presets
    });
    // Gerçek uygulamada API çağrısı yapılacak
  };

  const handlePreview = () => {
    console.log('Önizleme gösteriliyor...');
    // Gerçek uygulamada önizleme modalı açılacak
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Truck className="w-6 h-6" />
                    Kargo & Teslimat Yönetimi
                  </CardTitle>
                  <CardDescription className="mt-2">
                    ETA tahminleri, varyant ayarları, SLA kuralları ve analitikler
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Önizleme
                  </Button>
                  <Button onClick={handleSaveAll}>
                    <Save className="w-4 h-4 mr-2" />
                    Tümünü Kaydet
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Ana İçerik */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Kargo Ayarları
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Varyantlar
            </TabsTrigger>
            <TabsTrigger value="sla" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              SLA Kuralları
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Depolar
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tatiller
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analitikler
            </TabsTrigger>
          </TabsList>

          {/* Genel Bakış */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Durumu</CardTitle>
                  <CardDescription>
                    Kargo ve teslimat sisteminizin mevcut durumu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <div className="text-sm text-gray-600">Tahmin Doğruluğu</div>
                      <Badge variant="default" className="mt-2">Mükemmel</Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.1 gün</div>
                      <div className="text-sm text-gray-600">Ortalama Teslimat</div>
                      <Badge variant="secondary" className="mt-2">Hızlı</Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <div className="text-sm text-gray-600">Aktif Varyant</div>
                      <Badge variant="outline" className="mt-2">Normal</Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Aktif Uyarı</div>
                      <Badge variant="destructive" className="mt-2">Dikkat</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Yeni Kargo Preseti Oluştur
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Tatil Takvimi Güncelle
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      SLA Kuralları İçe Aktar
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Rapor Oluştur
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Son Aktiviteler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Model kalibre edildi</p>
                        <p className="text-xs text-gray-500">2 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Yeni varyant eklendi</p>
                        <p className="text-xs text-gray-500">5 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">SLA kuralı güncellendi</p>
                        <p className="text-xs text-gray-500">1 gün önce</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Kargo Ayarları */}
          <TabsContent value="shipping">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShippingEstimatePlugin
                initialConfig={shippingConfig}
                onConfigChange={setShippingConfig}
                productName="Demo Ürün"
              />
            </motion.div>
          </TabsContent>

          {/* Varyantlar */}
          <TabsContent value="variants">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VariantEtaEditor
                variants={variants}
                onVariantsChange={setVariants}
                productName="Demo Ürün"
              />
            </motion.div>
          </TabsContent>

          {/* SLA Kuralları */}
          <TabsContent value="sla">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SlaMatrixEditor
                rules={slaRules}
                onRulesChange={setSlaRules}
              />
            </motion.div>
          </TabsContent>

          {/* Depolar */}
          <TabsContent value="warehouses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WarehouseRulesEditor
                warehouses={warehouses}
                onWarehousesChange={setWarehouses}
              />
            </motion.div>
          </TabsContent>

          {/* Tatiller */}
          <TabsContent value="holidays">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HolidayCalendar
                holidays={holidays}
                onHolidaysChange={setHolidays}
              />
            </motion.div>
          </TabsContent>

          {/* Analitikler */}
          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <DeliveryAnalytics
                  onCalibrate={() => console.log('Model kalibre ediliyor...')}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Preset Yönetimi</CardTitle>
                    <CardDescription>
                      Kargo ayarları için hazır şablonları yönetin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PresetsBulkEditor
                      presets={presets}
                      onPresetsChange={setPresets}
                    />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
