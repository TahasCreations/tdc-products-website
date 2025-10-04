'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
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
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  Settings, 
  Eye, 
  Plus, 
  Trash2, 
  Info,
  Truck,
  Calendar as CalendarIcon
} from 'lucide-react';

import { 
  shippingEstimateConfigSchema, 
  ShippingEstimateConfig, 
  RegionCode, 
  regionLabels, 
  carrierOptions,
  defaultShippingConfig 
} from '../../schemas/shippingEstimate';
import { 
  calculateBaseETA, 
  generateETAPreview, 
  generateShippingStructuredData,
  ETAEstimate,
  ETAPreview 
} from '../../lib/shipping/eta';

interface ShippingEstimatePluginProps {
  initialConfig?: ShippingEstimateConfig;
  onConfigChange?: (config: ShippingEstimateConfig) => void;
  productName?: string;
  disabled?: boolean;
}

export function ShippingEstimatePlugin({ 
  initialConfig = defaultShippingConfig, 
  onConfigChange,
  productName = "Ürün",
  disabled = false 
}: ShippingEstimatePluginProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ETAPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ShippingEstimateConfig>({
    resolver: zodResolver(shippingEstimateConfigSchema),
    defaultValues: initialConfig,
    mode: 'onChange'
  });

  const { fields: regionFields, append: appendRegion, remove: removeRegion } = useFieldArray({
    control: form.control,
    name: 'regionOverrides'
  });

  const watchedValues = form.watch();
  const { productionType, estimateMode, businessDays, weekendDispatch, cutoffHour } = watchedValues;

  // Form değişikliklerini dinle ve preview güncelle
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(watchedValues);
    }
  }, [watchedValues, onConfigChange]);

  // Preview hesaplama
  const calculatePreview = async () => {
    setIsLoading(true);
    try {
      const preview = generateETAPreview(watchedValues);
      setPreviewData(preview);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Preview hesaplama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Bölge override ekleme
  const addRegionOverride = () => {
    appendRegion({
      region: "TR-Domestic",
      mode: "sabit",
      fixedDays: 1
    });
  };

  // Blackout tarihi ekleme
  const addBlackoutDate = () => {
    const currentDates = form.getValues('blackoutDates') || [];
    const today = format(new Date(), 'yyyy-MM-dd');
    form.setValue('blackoutDates', [...currentDates, today]);
  };

  // Blackout tarihi silme
  const removeBlackoutDate = (index: number) => {
    const currentDates = form.getValues('blackoutDates') || [];
    const newDates = currentDates.filter((_, i) => i !== index);
    form.setValue('blackoutDates', newDates);
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Gönderim & Üretim Süresi
              </CardTitle>
              <CardDescription>
                Müşterilere gösterilen tahmini teslim aralığını burada belirlersiniz.
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={calculatePreview}
                  disabled={disabled || isLoading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isLoading ? 'Hesaplanıyor...' : 'Önizleme'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Müşteriye gösterilecek teslimat bilgilerini önizleyin</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sol Kolon */}
              <div className="space-y-6">
                {/* Üretim Tipi */}
                <FormField
                  control={form.control}
                  name="productionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Üretim Tipi</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="stoklu" id="stoklu" />
                            <label htmlFor="stoklu" className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Hazır/Stoklu
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="elyapimi" id="elyapimi" />
                            <label htmlFor="elyapimi" className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              El Yapımı / Siparişe Göre
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tahmin Modu */}
                <FormField
                  control={form.control}
                  name="estimateMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahmin Modu</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sabit" id="sabit" />
                            <label htmlFor="sabit">Sabit Gün</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="aralik" id="aralik" />
                            <label htmlFor="aralik">Gün Aralığı</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="kural" id="kural" />
                            <label htmlFor="kural">Kurallara Göre Hesapla</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Temel Ayarlar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="businessDays"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={disabled}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>İş Günü Hesaplama</FormLabel>
                            <FormDescription>
                              Hafta sonları dahil edilmez
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="weekendDispatch"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={disabled}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Hafta Sonu Sevkiyat</FormLabel>
                            <FormDescription>
                              Cumartesi ve Pazar günleri kargo gönderimi
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Cutoff Saati */}
                <FormField
                  control={form.control}
                  name="cutoffHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Kesişme Saati (Cutoff)
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                          disabled={disabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Cutoff saati seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, '0')}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Bu saatten sonraki siparişler bir sonraki gün sayılır
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sağ Kolon */}
              <div className="space-y-6">
                {/* Temel Süre Ayarları */}
                {estimateMode === "sabit" && (
                  <FormField
                    control={form.control}
                    name="fixedDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hazırlık Süresi (Gün)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {estimateMode === "aralik" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Gün</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Gün</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* El Yapımı Ürünler için Kapasite Ayarları */}
                {productionType === "elyapimi" && estimateMode === "kural" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dailyCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Günlük Üretim Kapasitesi (Adet/Gün)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="backlogUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bekleyen Sipariş Adedi</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacityFactor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yoğunluk Çarpanı (0.5 - 2.0)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.5"
                              max="2.0"
                              step="0.1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Yoğun dönemlerde üretim süresini artırmak için
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Tatil Günleri */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Tatil/Blackout Günleri
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBlackoutDate}
                      disabled={disabled}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tarih Ekle
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="blackoutDates"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            {field.value?.map((date, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  type="date"
                                  value={date}
                                  onChange={(e) => {
                                    const newDates = [...(field.value || [])];
                                    newDates[index] = e.target.value;
                                    field.onChange(newDates);
                                  }}
                                  disabled={disabled}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeBlackoutDate(index)}
                                  disabled={disabled}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            {(!field.value || field.value.length === 0) && (
                              <p className="text-sm text-gray-500">
                                Henüz tatil günü eklenmemiş
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Bölge Override'ları */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Bölge Bazlı Ayarlar
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRegionOverride}
                  disabled={disabled}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bölge Ekle
                </Button>
              </div>

              <Accordion type="multiple" className="w-full">
                {regionFields.map((field, index) => (
                  <AccordionItem key={field.id} value={`region-${index}`}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {regionLabels[form.watch(`regionOverrides.${index}.region`) as RegionCode]}
                        </Badge>
                        {form.watch(`regionOverrides.${index}.carrier`) && (
                          <Badge variant="secondary">
                            {form.watch(`regionOverrides.${index}.carrier`)}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <FormField
                          control={form.control}
                          name={`regionOverrides.${index}.region`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bölge</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={disabled}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(regionLabels).map(([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`regionOverrides.${index}.mode`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mod</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={disabled}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="sabit">Sabit Gün</SelectItem>
                                    <SelectItem value="aralik">Gün Aralığı</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch(`regionOverrides.${index}.mode`) === "sabit" && (
                          <FormField
                            control={form.control}
                            name={`regionOverrides.${index}.fixedDays`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sabit Gün</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    disabled={disabled}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {form.watch(`regionOverrides.${index}.mode`) === "aralik" && (
                          <>
                            <FormField
                              control={form.control}
                              name={`regionOverrides.${index}.minDays`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Min Gün</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      disabled={disabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`regionOverrides.${index}.maxDays`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Max Gün</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      disabled={disabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <FormField
                          control={form.control}
                          name={`regionOverrides.${index}.carrier`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taşıyıcı</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={disabled}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Taşıyıcı seçin" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {carrierOptions.map((carrier) => (
                                      <SelectItem key={carrier.value} value={carrier.value}>
                                        {carrier.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`regionOverrides.${index}.note`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Not</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Müşteriye gösterilecek kısa uyarı"
                                  {...field}
                                  disabled={disabled}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRegion(index)}
                            disabled={disabled}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Önizleme Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Müşteri Görünümü Önizlemesi</DialogTitle>
            <DialogDescription>
              {productName} için müşterilere gösterilecek teslimat bilgileri
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-6">
              {/* Müşteri Mesajı */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Müşteriye Gösterilecek:</h4>
                <p className="text-blue-800">{previewData.customerMessage}</p>
              </div>

              {/* Tarih Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Kargo Tarihi:</h4>
                  <p className="text-green-800">{previewData.shippingDate}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Teslimat Tarihi:</h4>
                  <p className="text-orange-800">{previewData.deliveryDate}</p>
                </div>
              </div>

              {/* UI Etiketleri */}
              <div className="space-y-3">
                <h4 className="font-semibold">Sayfa Etiketleri:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Ürün Detay Sayfası:</span>
                    <p className="text-sm">{previewData.pdpLabel}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Sepet:</span>
                    <p className="text-sm">{previewData.cartLabel}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Checkout:</span>
                    <p className="text-sm">{previewData.checkoutLabel}</p>
                  </div>
                </div>
              </div>

              {/* JSON-LD Structured Data */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">JSON-LD Structured Data:</h4>
                <pre className="text-xs text-purple-800 bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(generateShippingStructuredData(
                    calculateBaseETA(watchedValues),
                    productName
                  ), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
