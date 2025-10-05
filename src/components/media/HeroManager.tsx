'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Image as ImageIcon,
  Settings,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  BarChart3,
  Target,
  Clock,
  Users,
  MousePointer
} from 'lucide-react';

import { HeroConfig, HeroConfigSchema, mediaLibrary } from '@/lib/media/mediaLibrary';

// Form şeması - basitleştirilmiş
const heroFormSchema = z.object({
  title: z.string().min(1, 'Başlık gerekli'),
  slug: z.string(),
  type: z.enum(['category', 'campaign', 'promotion', 'seasonal']),
  media: z.object({
    desktop: z.string().min(1, 'Desktop görsel gerekli'),
    tablet: z.string().optional(),
    mobile: z.string().optional()
  }),
  content: z.object({
    headline: z.string().min(1, 'Ana başlık gerekli'),
    subheadline: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    overlayOpacity: z.number().min(0).max(1)
  }),
  schedule: z.object({
    startDate: z.string().min(1, 'Başlangıç tarihi gerekli'),
    endDate: z.string().optional(),
    timezone: z.string()
  }).optional(),
  abTest: z.object({
    isActive: z.boolean(),
    variants: z.array(z.object({
      id: z.string(),
      traffic: z.number().min(0).max(100),
      media: z.object({
        desktop: z.string(),
        tablet: z.string().optional(),
        mobile: z.string().optional()
      }),
      content: z.object({
        headline: z.string(),
        subheadline: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional()
      })
    }))
  }).optional()
});
import { AutoImage, createCategoryHeroContext } from './AutoImage';

type HeroFormData = z.infer<typeof heroFormSchema>;

interface HeroManagerProps {
  slug: string;
  onHeroChange?: (hero: HeroConfig) => void;
  disabled?: boolean;
}

export function HeroManager({ slug, onHeroChange, disabled = false }: HeroManagerProps) {
  const [heroes, setHeroes] = useState<HeroConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroConfig | null>(null);
  const [previewHero, setPreviewHero] = useState<HeroConfig | null>(null);

  const form = useForm<HeroFormData>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      title: '',
      slug: slug,
      type: 'category',
      media: {
        desktop: '',
        tablet: '',
        mobile: ''
      },
      content: {
        headline: '',
        subheadline: '',
        ctaText: '',
        ctaLink: '',
        overlayOpacity: 0.3
      },
      schedule: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        timezone: 'Europe/Istanbul'
      },
      abTest: {
        isActive: false,
        variants: []
      }
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'abTest.variants'
  });

  // Hero'ları yükle
  const loadHeroes = async () => {
    try {
      setLoading(true);
      // Gerçek uygulamada API çağrısı yapılacak
      const mockHeroes: HeroConfig[] = [
        {
          id: '1',
          title: 'Ana Hero',
          slug: slug,
          type: 'category',
          media: {
            desktop: 'hero-1-desktop',
            tablet: 'hero-1-tablet',
            mobile: 'hero-1-mobile'
          },
          content: {
            headline: 'Yeni Koleksiyon',
            subheadline: 'Premium figürler ve koleksiyon ürünleri',
            ctaText: 'Keşfet',
            ctaLink: '/products',
            overlayOpacity: 0.3
          },
          analytics: {
            views: 1250,
            clicks: 89,
            conversions: 12
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setHeroes(mockHeroes);
    } catch (error) {
      console.error('Failed to load heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
  }, [slug]);

  // Hero ekleme/düzenleme
  const handleSaveHero = async (data: HeroFormData) => {
    try {
      const heroData: HeroConfig = {
        id: editingHero?.id || Date.now().toString(),
        ...data,
        analytics: editingHero?.analytics || { views: 0, clicks: 0, conversions: 0 },
        isActive: true,
        createdAt: editingHero?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingHero) {
        // Güncelleme
        setHeroes(prev => prev.map(h => h.id === editingHero.id ? heroData : h));
      } else {
        // Yeni ekleme
        setHeroes(prev => [heroData, ...prev]);
      }

      setEditDialogOpen(false);
      setEditingHero(null);
      form.reset();
      onHeroChange?.(heroData);
    } catch (error) {
      console.error('Failed to save hero:', error);
    }
  };

  // Hero silme
  const handleDeleteHero = async (heroId: string) => {
    try {
      setHeroes(prev => prev.filter(h => h.id !== heroId));
    } catch (error) {
      console.error('Failed to delete hero:', error);
    }
  };

  // Hero düzenleme
  const handleEditHero = (hero: HeroConfig) => {
    setEditingHero(hero);
    form.reset({
      title: hero.title,
      slug: hero.slug,
      type: hero.type,
      media: hero.media,
      content: hero.content,
      schedule: hero.schedule,
      abTest: hero.abTest
    });
    setEditDialogOpen(true);
  };

  // Hero önizleme
  const handlePreviewHero = (hero: HeroConfig) => {
    setPreviewHero(hero);
    setPreviewDialogOpen(true);
  };

  // A/B test varyantı ekleme
  const addVariant = () => {
    appendVariant({
      id: Date.now().toString(),
      traffic: 50,
      media: {
        desktop: '',
        tablet: '',
        mobile: ''
      },
      content: {
        headline: '',
        subheadline: '',
        ctaText: '',
        ctaLink: ''
      }
    });
  };

  // Aktif hero'yu belirle
  const getActiveHero = () => {
    const now = new Date();
    return heroes.find(hero => {
      if (!hero.isActive) return false;
      
      if (hero.schedule) {
        const startDate = new Date(hero.schedule.startDate);
        const endDate = hero.schedule.endDate ? new Date(hero.schedule.endDate) : null;
        
        if (now < startDate) return false;
        if (endDate && now > endDate) return false;
      }
      
      return true;
    });
  };

  const activeHero = getActiveHero();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Hero Yöneticisi
              </CardTitle>
              <CardDescription>
                {slug} kategorisi için hero görsellerini yönetin
              </CardDescription>
            </div>
            
            <Button
              onClick={() => setEditDialogOpen(true)}
              disabled={disabled}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Hero
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Aktif Hero */}
      {activeHero && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-600" />
              Aktif Hero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Preview */}
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <AutoImage
                    context={createCategoryHeroContext(
                      slug,
                      activeHero.content.headline,
                      activeHero.content.subheadline,
                      activeHero.content.ctaText
                    )}
                    className="w-full h-full"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewHero(activeHero)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Önizle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditHero(activeHero)}
                    disabled={disabled}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
              </div>

              {/* Hero Bilgileri */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{activeHero.title}</h3>
                  <p className="text-gray-600">{activeHero.content.headline}</p>
                  {activeHero.content.subheadline && (
                    <p className="text-sm text-gray-500">{activeHero.content.subheadline}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{activeHero.analytics.views}</div>
                    <div className="text-sm text-blue-600">Görüntüleme</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{activeHero.analytics.clicks}</div>
                    <div className="text-sm text-green-600">Tıklama</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{activeHero.analytics.conversions}</div>
                    <div className="text-sm text-purple-600">Dönüşüm</div>
                  </div>
                </div>

                {activeHero.abTest?.isActive && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">A/B Test Aktif</span>
                    </div>
                    <div className="text-sm text-yellow-700">
                      {activeHero.abTest.variants.length} varyant test ediliyor
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Hero'lar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : heroes.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hero bulunamadı</h3>
              <p className="text-gray-500 mb-4">Bu kategori için henüz hero oluşturulmamış.</p>
              <Button onClick={() => setEditDialogOpen(true)} disabled={disabled}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Hero'yu Oluştur
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hero</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Analytics</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroes.map((hero) => (
                  <TableRow key={hero.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{hero.title}</div>
                        <div className="text-sm text-gray-500">{hero.content.headline}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{hero.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={hero.isActive ? 'default' : 'secondary'}>
                          {hero.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                        {hero.abTest?.isActive && (
                          <Badge variant="outline">A/B Test</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>👁️ {hero.analytics.views}</div>
                        <div>👆 {hero.analytics.clicks}</div>
                        <div>🎯 {hero.analytics.conversions}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handlePreviewHero(hero)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditHero(hero)} disabled={disabled}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteHero(hero.id)} disabled={disabled}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHero ? 'Hero Düzenle' : 'Yeni Hero Oluştur'}
            </DialogTitle>
            <DialogDescription>
              Hero görseli ve içeriğini yapılandırın
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveHero)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Temel</TabsTrigger>
                  <TabsTrigger value="media">Medya</TabsTrigger>
                  <TabsTrigger value="content">İçerik</TabsTrigger>
                  <TabsTrigger value="schedule">Zamanlama</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Başlığı</FormLabel>
                          <FormControl>
                            <Input placeholder="Örn: Yeni Koleksiyon" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tip</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="category">Kategori</SelectItem>
                              <SelectItem value="campaign">Kampanya</SelectItem>
                              <SelectItem value="seasonal">Sezonsal</SelectItem>
                              <SelectItem value="promotion">Promosyon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="media.desktop"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desktop Görsel</FormLabel>
                          <FormControl>
                            <Input placeholder="Medya ID veya URL" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="media.tablet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tablet Görsel (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Medya ID veya URL" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="media.mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Görsel (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Medya ID veya URL" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content.headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ana Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Ana başlık" {...field} disabled={disabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content.subheadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Alt başlık" {...field} disabled={disabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="content.ctaText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Metni</FormLabel>
                          <FormControl>
                            <Input placeholder="Keşfet" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content.ctaLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Linki</FormLabel>
                          <FormControl>
                            <Input placeholder="/products" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content.overlayOpacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overlay Opacity: {field.value}</FormLabel>
                        <FormControl>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            {...field}
                            disabled={disabled}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schedule.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Başlangıç Tarihi</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schedule.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bitiş Tarihi (Opsiyonel)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="abTest.isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>A/B Test</FormLabel>
                          <FormDescription>
                            Farklı varyantları test edin
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('abTest.isActive') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Test Varyantları</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addVariant}
                          disabled={disabled}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Varyant Ekle
                        </Button>
                      </div>

                      {variantFields.map((field, index) => (
                        <Card key={field.id}>
                          <CardHeader>
                            <CardTitle className="text-sm">Varyant {index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`abTest.variants.${index}.traffic`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Trafik (%)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                              name={`abTest.variants.${index}.content.headline`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Varyant Başlığı</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={disabled} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVariant(index)}
                              disabled={disabled}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Varyantı Sil
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={disabled}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={disabled}>
                  {editingHero ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Önizleme Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Hero Önizlemesi</DialogTitle>
            <DialogDescription>
              {previewHero?.title} - Farklı cihazlarda nasıl görüneceği
            </DialogDescription>
          </DialogHeader>
          
          {previewHero && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Desktop</div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <AutoImage
                      context={createCategoryHeroContext(
                        previewHero.slug,
                        previewHero.content.headline,
                        previewHero.content.subheadline,
                        previewHero.content.ctaText
                      )}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Tablet</div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <AutoImage
                      context={createCategoryHeroContext(
                        previewHero.slug,
                        previewHero.content.headline,
                        previewHero.content.subheadline,
                        previewHero.content.ctaText
                      )}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">Mobile</div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <AutoImage
                      context={createCategoryHeroContext(
                        previewHero.slug,
                        previewHero.content.headline,
                        previewHero.content.subheadline,
                        previewHero.content.ctaText
                      )}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
