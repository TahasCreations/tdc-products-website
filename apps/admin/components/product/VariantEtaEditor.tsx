'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { 
  Package, 
  Settings, 
  Copy, 
  Trash2, 
  Plus, 
  Eye,
  Clock,
  MapPin
} from 'lucide-react';

import { 
  productVariantSchema,
  shippingEstimateConfigSchema,
  ProductVariant,
  ShippingEstimateConfig,
  ShippingPreset,
  defaultPresets,
  defaultShippingConfig
} from '../../schemas/shippingEstimate';
import { 
  generateAdvancedETAPreview,
  calculateAdvancedETA 
} from '../../lib/shipping/eta';

interface VariantEtaEditorProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  productName: string;
  disabled?: boolean;
}

interface VariantFormData {
  variants: (ProductVariant & { 
    selected?: boolean;
    preview?: any;
  })[];
}

export function VariantEtaEditor({ 
  variants, 
  onVariantsChange, 
  productName,
  disabled = false 
}: VariantEtaEditorProps) {
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const form = useForm<VariantFormData>({
    resolver: zodResolver(z.object({
      variants: z.array(productVariantSchema)
    })),
    defaultValues: {
      variants: variants.map(v => ({ ...v, selected: false }))
    }
  });

  const { fields: variantFields, update: updateVariant } = useFieldArray({
    control: form.control,
    name: 'variants'
  });

  const watchedVariants = form.watch('variants');

  // Varyant seçimi
  const handleVariantSelect = (variantId: string, selected: boolean) => {
    const newSelected = selected 
      ? [...selectedVariants, variantId]
      : selectedVariants.filter(id => id !== variantId);
    setSelectedVariants(newSelected);
  };

  // Tümünü seç/seçme
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedVariants(variants.map(v => v.sku));
    } else {
      setSelectedVariants([]);
    }
  };

  // Preset uygulama
  const handleApplyPreset = (preset: ShippingPreset) => {
    const updatedVariants = watchedVariants.map(variant => {
      if (selectedVariants.includes(variant.sku)) {
        return {
          ...variant,
          shippingEstimateVariant: 'override',
          shippingEstimate: {
            productionType: preset.productionType,
            estimateMode: preset.estimateMode,
            businessDays: preset.businessDays,
            weekendDispatch: preset.weekendDispatch,
            cutoffHour: preset.cutoffHour,
            fixedDays: preset.fixedDays,
            minDays: preset.minDays,
            maxDays: preset.maxDays,
            capacityFactor: preset.capacityFactor,
            dailyCapacity: preset.dailyCapacity,
            regionOverrides: [],
            blackoutDates: []
          }
        };
      }
      return variant;
    });

    form.setValue('variants', updatedVariants);
    onVariantsChange(updatedVariants.map(({ selected, preview, ...variant }) => variant));
    setPresetDialogOpen(false);
  };

  // Toplu kopyalama
  const handleBulkCopy = () => {
    if (selectedVariants.length === 0) return;
    
    const sourceVariant = watchedVariants.find(v => selectedVariants.includes(v.sku));
    if (!sourceVariant?.shippingEstimate) return;

    const updatedVariants = watchedVariants.map(variant => {
      if (selectedVariants.includes(variant.sku)) {
        return {
          ...variant,
          shippingEstimateVariant: 'override',
          shippingEstimate: sourceVariant.shippingEstimate
        };
      }
      return variant;
    });

    form.setValue('variants', updatedVariants);
    onVariantsChange(updatedVariants.map(({ selected, preview, ...variant }) => variant));
  };

  // Önizleme hesaplama
  const handlePreview = (variant: ProductVariant) => {
    const config = variant.shippingEstimate || defaultShippingConfig;
    const preview = generateAdvancedETAPreview(config);
    setPreviewData({ variant, preview });
    setPreviewDialogOpen(true);
  };

  // Varyant güncelleme
  const handleVariantUpdate = (index: number, field: string, value: any) => {
    updateVariant(index, {
      ...watchedVariants[index],
      [field]: value
    });
  };

  // Form değişikliklerini kaydet
  const handleSave = () => {
    const updatedVariants = watchedVariants.map(({ selected, preview, ...variant }) => variant);
    onVariantsChange(updatedVariants);
  };

  return (
    <div className="space-y-6">
      {/* Toplu İşlemler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Varyant Kargo Ayarları
          </CardTitle>
          <CardDescription>
            Ürün varyantları için kargo sürelerini yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedVariants.length === variants.length}
                onCheckedChange={handleSelectAll}
                disabled={disabled}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Tümünü Seç ({selectedVariants.length}/{variants.length})
              </label>
            </div>
            
            {selectedVariants.length > 0 && (
              <div className="flex items-center space-x-2">
                <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" disabled={disabled}>
                      <Plus className="w-4 h-4 mr-2" />
                      Preset Uygula
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Preset Seç</DialogTitle>
                      <DialogDescription>
                        Seçili varyantlara hangi preset'i uygulamak istiyorsunuz?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      {defaultPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleApplyPreset(preset)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-sm text-gray-500">{preset.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleBulkCopy}
                  disabled={disabled}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Kopyala
                </Button>

                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSave}
                  disabled={disabled}
                >
                  Kaydet
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Varyant Listesi */}
      <div className="space-y-4">
        {variantFields.map((field, index) => {
          const variant = watchedVariants[index];
          const isSelected = selectedVariants.includes(variant.sku);
          const hasOverride = variant.shippingEstimateVariant === 'override';

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={isSelected ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleVariantSelect(variant.sku, !!checked)}
                        disabled={disabled}
                      />
                      <div>
                        <CardTitle className="text-lg">{variant.name}</CardTitle>
                        <CardDescription>
                          SKU: {variant.sku} • Stok: {variant.stock}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={hasOverride ? 'default' : 'secondary'}>
                        {hasOverride ? 'Özel' : 'Varsayılan'}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(variant)}
                        disabled={disabled}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Önizle
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sol: Varyant Bilgileri */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Fiyat</label>
                          <Input
                            type="number"
                            value={variant.price || ''}
                            onChange={(e) => handleVariantUpdate(index, 'price', parseFloat(e.target.value) || 0)}
                            disabled={disabled}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Stok</label>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantUpdate(index, 'stock', parseInt(e.target.value) || 0)}
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Kargo Ayarları</label>
                        <RadioGroup
                          value={variant.shippingEstimateVariant}
                          onValueChange={(value) => handleVariantUpdate(index, 'shippingEstimateVariant', value)}
                          disabled={disabled}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inherit" id={`inherit-${index}`} />
                            <label htmlFor={`inherit-${index}`} className="text-sm">
                              Ana ürün ayarlarını kullan
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="override" id={`override-${index}`} />
                            <label htmlFor={`override-${index}`} className="text-sm">
                              Özel ayarlar tanımla
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Sağ: Özel Kargo Ayarları */}
                    {hasOverride && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Özel Kargo Ayarları</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Üretim Tipi</label>
                              <Select
                                value={variant.shippingEstimate?.productionType || 'stoklu'}
                                onValueChange={(value) => handleVariantUpdate(index, 'shippingEstimate', {
                                  ...variant.shippingEstimate,
                                  productionType: value
                                })}
                                disabled={disabled}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="stoklu">Hazır/Stoklu</SelectItem>
                                  <SelectItem value="elyapimi">El Yapımı</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700">Tahmin Modu</label>
                              <Select
                                value={variant.shippingEstimate?.estimateMode || 'sabit'}
                                onValueChange={(value) => handleVariantUpdate(index, 'shippingEstimate', {
                                  ...variant.shippingEstimate,
                                  estimateMode: value
                                })}
                                disabled={disabled}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sabit">Sabit Gün</SelectItem>
                                  <SelectItem value="aralik">Gün Aralığı</SelectItem>
                                  <SelectItem value="kural">Kurallara Göre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={variant.shippingEstimate?.businessDays || true}
                                onCheckedChange={(checked) => handleVariantUpdate(index, 'shippingEstimate', {
                                  ...variant.shippingEstimate,
                                  businessDays: checked
                                })}
                                disabled={disabled}
                              />
                              <label className="text-sm">İş Günü</label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={variant.shippingEstimate?.weekendDispatch || false}
                                onCheckedChange={(checked) => handleVariantUpdate(index, 'shippingEstimate', {
                                  ...variant.shippingEstimate,
                                  weekendDispatch: checked
                                })}
                                disabled={disabled}
                              />
                              <label className="text-sm">Hafta Sonu Sevkiyat</label>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700">Cutoff Saati</label>
                            <Select
                              value={(variant.shippingEstimate?.cutoffHour || 16).toString()}
                              onValueChange={(value) => handleVariantUpdate(index, 'shippingEstimate', {
                                ...variant.shippingEstimate,
                                cutoffHour: parseInt(value)
                              })}
                              disabled={disabled}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i.toString().padStart(2, '0')}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Süre Ayarları */}
                          {variant.shippingEstimate?.estimateMode === 'sabit' && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-gray-700">Sabit Gün</label>
                              <Input
                                type="number"
                                min="0"
                                value={variant.shippingEstimate?.fixedDays || ''}
                                onChange={(e) => handleVariantUpdate(index, 'shippingEstimate', {
                                  ...variant.shippingEstimate,
                                  fixedDays: parseInt(e.target.value) || 0
                                })}
                                disabled={disabled}
                              />
                            </div>
                          )}

                          {variant.shippingEstimate?.estimateMode === 'aralik' && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Min Gün</label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={variant.shippingEstimate?.minDays || ''}
                                  onChange={(e) => handleVariantUpdate(index, 'shippingEstimate', {
                                    ...variant.shippingEstimate,
                                    minDays: parseInt(e.target.value) || 0
                                  })}
                                  disabled={disabled}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Max Gün</label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={variant.shippingEstimate?.maxDays || ''}
                                  onChange={(e) => handleVariantUpdate(index, 'shippingEstimate', {
                                    ...variant.shippingEstimate,
                                    maxDays: parseInt(e.target.value) || 0
                                  })}
                                  disabled={disabled}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Önizleme Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Varyant Önizlemesi</DialogTitle>
            <DialogDescription>
              {previewData?.variant.name} için müşteri görünümü
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Müşteriye Gösterilecek:</h4>
                <p className="text-blue-800">{previewData.preview.customerMessage}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Kargo Tarihi:</h4>
                  <p className="text-green-800">{previewData.preview.shippingDate}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Teslimat Tarihi:</h4>
                  <p className="text-orange-800">{previewData.preview.deliveryDate}</p>
                </div>
              </div>

              {previewData.preview.cutoffCountdown && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Cutoff Sayacı:</h4>
                  <p className="text-purple-800 font-mono text-lg">{previewData.preview.cutoffCountdown}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
