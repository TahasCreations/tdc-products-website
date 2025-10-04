'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Package, 
  Image, 
  Settings, 
  Truck,
  Save,
  Eye
} from 'lucide-react';

import { ShippingEstimatePlugin } from './ShippingEstimatePlugin';
import { ShippingEstimateConfig, defaultShippingConfig } from '../../schemas/shippingEstimate';

// Ürün form şeması
const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı gerekli'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  price: z.number().min(0, 'Fiyat 0\'dan büyük olmalı'),
  category: z.string().min(1, 'Kategori seçin'),
  images: z.array(z.string()).min(1, 'En az 1 görsel gerekli'),
  stock: z.number().min(0, 'Stok 0\'dan küçük olamaz'),
  isActive: z.boolean().default(true),
  shippingConfig: z.any().optional() // ShippingEstimateConfig
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit?: (data: ProductFormData) => void;
  onPreview?: (data: ProductFormData) => void;
  disabled?: boolean;
}

export function ProductForm({ 
  initialData, 
  onSubmit, 
  onPreview,
  disabled = false 
}: ProductFormProps) {
  const [shippingConfig, setShippingConfig] = useState<ShippingEstimateConfig>(
    initialData?.shippingConfig || defaultShippingConfig
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      stock: 0,
      isActive: true,
      shippingConfig: defaultShippingConfig,
      ...initialData
    }
  });

  const handleSubmit = (data: ProductFormData) => {
    const formData = {
      ...data,
      shippingConfig
    };
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handlePreview = () => {
    const data = form.getValues();
    const formData = {
      ...data,
      shippingConfig
    };
    
    if (onPreview) {
      onPreview(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Genel
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Medya
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Kargo
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Ayarlar
              </TabsTrigger>
            </TabsList>

            {/* Genel Bilgiler */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ürün Bilgileri</CardTitle>
                  <CardDescription>
                    Temel ürün bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ürün Adı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ürün adını girin"
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ürün açıklamasını girin"
                            className="min-h-[100px]"
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormDescription>
                          Ürünün detaylı açıklamasını yazın
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fiyat (₺)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stok Miktarı</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
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

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={disabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="figur">Figür & Koleksiyon</SelectItem>
                              <SelectItem value="moda">Moda & Aksesuar</SelectItem>
                              <SelectItem value="elektronik">Elektronik</SelectItem>
                              <SelectItem value="ev">Ev & Yaşam</SelectItem>
                              <SelectItem value="sanat">Sanat & Hobi</SelectItem>
                              <SelectItem value="hediyelik">Hediyelik</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medya */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ürün Görselleri</CardTitle>
                  <CardDescription>
                    Ürün görsellerini yükleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Görselleri buraya sürükleyin veya tıklayarak seçin
                    </p>
                    <Button type="button" variant="outline" disabled={disabled}>
                      Görsel Yükle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kargo Ayarları */}
            <TabsContent value="shipping" className="space-y-6">
              <ShippingEstimatePlugin
                initialConfig={shippingConfig}
                onConfigChange={setShippingConfig}
                productName={form.watch('name') || 'Ürün'}
                disabled={disabled}
              />
            </TabsContent>

            {/* Ayarlar */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ürün Ayarları</CardTitle>
                  <CardDescription>
                    Ürün durumu ve diğer ayarlar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Aktif Ürün
                          </FormLabel>
                          <FormDescription>
                            Ürün müşterilere görünür olacak
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={disabled}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={disabled}
            >
              <Eye className="w-4 h-4 mr-2" />
              Önizleme
            </Button>
            <Button
              type="submit"
              disabled={disabled}
            >
              <Save className="w-4 h-4 mr-2" />
              Ürünü Kaydet
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
