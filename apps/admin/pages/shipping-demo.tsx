'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

import { ShippingEstimatePlugin } from '../components/product/ShippingEstimatePlugin';
import { ProductForm } from '../components/product/ProductForm';
import { ShippingEstimateConfig, defaultShippingConfig } from '../schemas/shippingEstimate';
import { generateETAPreview, calculateBaseETA } from '../lib/shipping/eta';

export default function ShippingDemoPage() {
  const [shippingConfig, setShippingConfig] = useState<ShippingEstimateConfig>(defaultShippingConfig);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleConfigChange = (config: ShippingEstimateConfig) => {
    setShippingConfig(config);
    
    // Otomatik preview hesaplama
    try {
      const preview = generateETAPreview(config);
      setPreviewData(preview);
    } catch (error) {
      console.error('Preview hesaplama hatası:', error);
    }
  };

  const handleProductSubmit = (data: any) => {
    console.log('Ürün formu gönderildi:', data);
    alert('Ürün başarıyla kaydedildi! (Demo)');
  };

  const handleProductPreview = (data: any) => {
    console.log('Ürün önizleme:', data);
    alert('Ürün önizleme açıldı! (Demo)');
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
              TDC Market - Kargo & Üretim Süresi Yönetimi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stoklu ürünler ile el yapımı ürünlerin farklı hazırlık/kargo sürelerini yönetin. 
              Müşterilere doğru teslimat bilgileri gösterin.
            </p>
          </motion.div>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Truck className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Bölge Bazlı Ayarlar</h3>
                <p className="text-sm text-gray-600">
                  Her bölge için farklı kargo süreleri ve taşıyıcı seçenekleri
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Package className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Üretim Tipi Desteği</h3>
                <p className="text-sm text-gray-600">
                  Stoklu ve el yapımı ürünler için farklı hesaplama modları
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Akıllı Hesaplama</h3>
                <p className="text-sm text-gray-600">
                  İş günleri, tatil günleri ve cutoff saatlerini dikkate alır
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Canlı Önizleme</h3>
                <p className="text-sm text-gray-600">
                  Müşteriye gösterilecek bilgileri anlık olarak görün
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol: Kargo Ayarları */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ShippingEstimatePlugin
              initialConfig={shippingConfig}
              onConfigChange={handleConfigChange}
              productName="Demo Ürün"
            />
          </motion.div>

          {/* Sağ: Canlı Önizleme */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Müşteri Görünümü */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Müşteri Görünümü
                </CardTitle>
                <CardDescription>
                  Müşterilere gösterilecek teslimat bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previewData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Ürün Detay Sayfası:</h4>
                      <p className="text-blue-800">{previewData.pdpLabel}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Sepet:</h4>
                      <p className="text-green-800">{previewData.cartLabel}</p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Checkout:</h4>
                      <p className="text-orange-800">{previewData.checkoutLabel}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-600">Kargo Tarihi:</span>
                        <p className="text-sm">{previewData.shippingDate}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-600">Teslimat:</span>
                        <p className="text-sm">{previewData.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Kargo ayarlarını yapın ve canlı önizlemeyi görün</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Konfigürasyon Özeti */}
            <Card>
              <CardHeader>
                <CardTitle>Mevcut Ayarlar</CardTitle>
                <CardDescription>
                  Seçili kargo konfigürasyonu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Üretim Tipi:</span>
                    <Badge variant={shippingConfig.productionType === 'stoklu' ? 'default' : 'secondary'}>
                      {shippingConfig.productionType === 'stoklu' ? 'Hazır/Stoklu' : 'El Yapımı'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tahmin Modu:</span>
                    <Badge variant="outline">
                      {shippingConfig.estimateMode === 'sabit' ? 'Sabit Gün' : 
                       shippingConfig.estimateMode === 'aralik' ? 'Gün Aralığı' : 'Kurallara Göre'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İş Günü:</span>
                    <Badge variant={shippingConfig.businessDays ? 'default' : 'secondary'}>
                      {shippingConfig.businessDays ? 'Evet' : 'Hayır'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hafta Sonu Sevkiyat:</span>
                    <Badge variant={shippingConfig.weekendDispatch ? 'default' : 'secondary'}>
                      {shippingConfig.weekendDispatch ? 'Evet' : 'Hayır'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cutoff Saati:</span>
                    <span className="text-sm font-medium">{shippingConfig.cutoffHour}:00</span>
                  </div>
                  
                  {shippingConfig.regionOverrides && shippingConfig.regionOverrides.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bölge Override:</span>
                      <span className="text-sm font-medium">{shippingConfig.regionOverrides.length} bölge</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ürün Formu Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Ürün Formu Entegrasyonu</CardTitle>
              <CardDescription>
                Kargo ayarlarının ürün formuna nasıl entegre edildiğini görün
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm
                initialData={{
                  name: 'Demo Ürün',
                  description: 'Bu bir demo üründür',
                  price: 299.99,
                  category: 'figur',
                  stock: 10,
                  isActive: true,
                  shippingConfig: shippingConfig
                }}
                onSubmit={handleProductSubmit}
                onPreview={handleProductPreview}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Kargo süresi hesaplama için kullanılabilir API endpoint'leri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">GET /api/shipping-estimate</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Mevcut konfigürasyon ile ETA hesaplama
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    ?config={JSON.stringify(shippingConfig)}&region=TR-Domestic
                  </code>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">POST /api/shipping-estimate</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Yeni kargo konfigürasyonu kaydetme
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    Body: {JSON.stringify(shippingConfig, null, 2)}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
