'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Copy,
  Download,
  Upload,
  Save,
  Undo2,
  History,
  Search,
  Filter
} from 'lucide-react';

import { 
  shippingPresetSchema,
  ShippingPreset,
  defaultPresets,
  regionLabels,
  RegionCode
} from '../../schemas/shippingEstimate';

interface PresetsBulkEditorProps {
  presets: ShippingPreset[];
  onPresetsChange: (presets: ShippingPreset[]) => void;
  disabled?: boolean;
}

const presetFormSchema = z.object({
  name: z.string().min(1, 'Preset adı gerekli'),
  description: z.string().min(1, 'Açıklama gerekli'),
  productionType: z.enum(['stoklu', 'elyapimi']),
  estimateMode: z.enum(['sabit', 'aralik', 'kural']),
  businessDays: z.boolean(),
  weekendDispatch: z.boolean(),
  cutoffHour: z.number().min(0).max(23),
  fixedDays: z.number().min(0).optional(),
  minDays: z.number().min(0).optional(),
  maxDays: z.number().min(0).optional(),
  dailyCapacity: z.number().min(0).optional(),
  backlogUnits: z.number().min(0).optional(),
  capacityFactor: z.number().min(0.5).max(2.0).optional(),
  isActive: z.boolean().default(true)
});

type PresetFormData = z.infer<typeof presetFormSchema>;

export function PresetsBulkEditor({ 
  presets, 
  onPresetsChange, 
  disabled = false 
}: PresetsBulkEditorProps) {
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<ShippingPreset | null>(null);
  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const form = useForm<PresetFormData>({
    resolver: zodResolver(presetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      productionType: 'stoklu',
      estimateMode: 'sabit',
      businessDays: true,
      weekendDispatch: false,
      cutoffHour: 16,
      fixedDays: 1,
      isActive: true
    }
  });

  // Filtrelenmiş presets
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || preset.productionType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Preset seçimi
  const handlePresetSelect = (presetId: string, selected: boolean) => {
    if (selected) {
      setSelectedPresets([...selectedPresets, presetId]);
    } else {
      setSelectedPresets(selectedPresets.filter(id => id !== presetId));
    }
  };

  // Tümünü seç/seçme
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedPresets(filteredPresets.map(p => p.name));
    } else {
      setSelectedPresets([]);
    }
  };

  // Yeni preset ekleme
  const handleAddPreset = () => {
    form.reset();
    setEditingPreset(null);
    setEditDialogOpen(true);
  };

  // Preset düzenleme
  const handleEditPreset = (preset: ShippingPreset) => {
    setEditingPreset(preset);
    form.reset({
      name: preset.name,
      description: preset.description,
      productionType: preset.productionType,
      estimateMode: preset.estimateMode,
      businessDays: preset.businessDays,
      weekendDispatch: preset.weekendDispatch,
      cutoffHour: preset.cutoffHour,
      fixedDays: preset.fixedDays,
      minDays: preset.minDays,
      maxDays: preset.maxDays,
      dailyCapacity: preset.dailyCapacity,
      backlogUnits: preset.backlogUnits,
      capacityFactor: preset.capacityFactor,
      isActive: preset.isActive
    });
    setEditDialogOpen(true);
  };

  // Preset kaydetme
  const handleSavePreset = (data: PresetFormData) => {
    if (editingPreset) {
      // Güncelleme
      const updatedPresets = presets.map(p => 
        p.name === editingPreset.name 
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      );
      onPresetsChange(updatedPresets);
    } else {
      // Yeni ekleme
      const newPreset: ShippingPreset = {
        ...data,
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onPresetsChange([...presets, newPreset]);
    }
    setEditDialogOpen(false);
    setEditingPreset(null);
    form.reset();
  };

  // Preset silme
  const handleDeletePreset = (presetName: string) => {
    const updatedPresets = presets.filter(p => p.name !== presetName);
    onPresetsChange(updatedPresets);
    setSelectedPresets(selectedPresets.filter(name => name !== presetName));
  };

  // Toplu silme
  const handleBulkDelete = () => {
    const updatedPresets = presets.filter(p => !selectedPresets.includes(p.name));
    onPresetsChange(updatedPresets);
    setSelectedPresets([]);
  };

  // Preset kopyalama
  const handleCopyPreset = (preset: ShippingPreset) => {
    const newPreset: ShippingPreset = {
      ...preset,
      name: `${preset.name} (Kopya)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onPresetsChange([...presets, newPreset]);
  };

  // CSV Export
  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Description', 'Production Type', 'Estimate Mode', 'Business Days', 'Weekend Dispatch', 'Cutoff Hour', 'Fixed Days', 'Min Days', 'Max Days', 'Daily Capacity', 'Backlog Units', 'Capacity Factor', 'Active', 'Created At'],
      ...presets.map(p => [
        p.name,
        p.description,
        p.productionType,
        p.estimateMode,
        p.businessDays.toString(),
        p.weekendDispatch.toString(),
        p.cutoffHour.toString(),
        p.fixedDays?.toString() || '',
        p.minDays?.toString() || '',
        p.maxDays?.toString() || '',
        p.dailyCapacity?.toString() || '',
        p.backlogUnits?.toString() || '',
        p.capacityFactor?.toString() || '',
        p.isActive.toString(),
        p.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipping-presets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const importedPresets: ShippingPreset[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const preset: ShippingPreset = {
            name: values[0] || `Imported Preset ${i}`,
            description: values[1] || 'Imported preset',
            productionType: values[2] as 'stoklu' | 'elyapimi' || 'stoklu',
            estimateMode: values[3] as 'sabit' | 'aralik' | 'kural' || 'sabit',
            businessDays: values[4] === 'true',
            weekendDispatch: values[5] === 'true',
            cutoffHour: parseInt(values[6]) || 16,
            fixedDays: values[7] ? parseInt(values[7]) : undefined,
            minDays: values[8] ? parseInt(values[8]) : undefined,
            maxDays: values[9] ? parseInt(values[9]) : undefined,
            dailyCapacity: values[10] ? parseInt(values[10]) : undefined,
            backlogUnits: values[11] ? parseInt(values[11]) : undefined,
            capacityFactor: values[12] ? parseFloat(values[12]) : undefined,
            isActive: values[13] !== 'false',
            createdAt: values[14] || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          importedPresets.push(preset);
        }
      }
      
      onPresetsChange([...presets, ...importedPresets]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header ve Toplu İşlemler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Kargo Preset Yönetimi
              </CardTitle>
              <CardDescription>
                Kargo ayarları için hazır şablonları yönetin ve toplu işlemler yapın
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleAddPreset}
                disabled={disabled}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Preset
              </Button>
              
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                disabled={disabled}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV Export
              </Button>
              
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    CSV Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Arama ve Filtreler */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Preset ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={disabled}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="stoklu">Hazır/Stoklu</SelectItem>
                <SelectItem value="elyapimi">El Yapımı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toplu İşlemler */}
          {selectedPresets.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPresets.length} preset seçildi
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Seçilenleri Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Presetleri Sil</AlertDialogTitle>
                      <AlertDialogDescription>
                        Seçili {selectedPresets.length} preset kalıcı olarak silinecek. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete}>
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Preset Tablosu */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedPresets.length === filteredPresets.length && filteredPresets.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={disabled}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Mod</TableHead>
                  <TableHead>Ayarlar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-32">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresets.map((preset, index) => (
                  <motion.tr
                    key={preset.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedPresets.includes(preset.name)}
                        onChange={(e) => handlePresetSelect(preset.name, e.target.checked)}
                        disabled={disabled}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{preset.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {preset.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={preset.productionType === 'stoklu' ? 'default' : 'secondary'}>
                        {preset.productionType === 'stoklu' ? 'Hazır' : 'El Yapımı'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {preset.estimateMode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={preset.businessDays ? 'text-green-600' : 'text-gray-400'}>•</span>
                          <span className="text-xs">İş Günü</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={preset.weekendDispatch ? 'text-blue-600' : 'text-gray-400'}>•</span>
                          <span className="text-xs">Hafta Sonu</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Cutoff: {preset.cutoffHour}:00
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={preset.isActive ? 'default' : 'secondary'}>
                        {preset.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditPreset(preset)}
                          disabled={disabled}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyPreset(preset)}
                          disabled={disabled}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={disabled}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Preset Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{preset.name}" preset'i kalıcı olarak silinecek. Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePreset(preset.name)}>
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Preset Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPreset ? 'Preset Düzenle' : 'Yeni Preset Oluştur'}
            </DialogTitle>
            <DialogDescription>
              Kargo ayarları için yeni bir şablon oluşturun veya mevcut şablonu düzenleyin
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSavePreset)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preset Adı</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: Hızlı Kargo"
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
                        <Input
                          placeholder="Preset açıklaması"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="stoklu" id="stoklu-preset" />
                            <label htmlFor="stoklu-preset">Hazır/Stoklu</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="elyapimi" id="elyapimi-preset" />
                            <label htmlFor="elyapimi-preset">El Yapımı</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimateMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahmin Modu</FormLabel>
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
                            <SelectItem value="kural">Kurallara Göre</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessDays"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>İş Günü Hesaplama</FormLabel>
                        <FormDescription>
                          Hafta sonları dahil edilmez
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

                <FormField
                  control={form.control}
                  name="weekendDispatch"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Hafta Sonu Sevkiyat</FormLabel>
                        <FormDescription>
                          Cumartesi ve Pazar günleri kargo
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
              </div>

              <FormField
                control={form.control}
                name="cutoffHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kesişme Saati (Cutoff)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
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
                    </FormControl>
                    <FormDescription>
                      Bu saatten sonraki siparişler bir sonraki gün sayılır
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dinamik Alanlar */}
              {form.watch('estimateMode') === 'sabit' && (
                <FormField
                  control={form.control}
                  name="fixedDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sabit Gün Sayısı</FormLabel>
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

              {form.watch('estimateMode') === 'aralik' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Gün</FormLabel>
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
                        <FormLabel>Maksimum Gün</FormLabel>
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

              {form.watch('productionType') === 'elyapimi' && form.watch('estimateMode') === 'kural' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dailyCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Günlük Kapasite</FormLabel>
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
                        <FormLabel>Kapasite Çarpanı</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Aktif Preset</FormLabel>
                      <FormDescription>
                        Preset kullanılabilir durumda
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
                  <Save className="w-4 h-4 mr-2" />
                  {editingPreset ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
