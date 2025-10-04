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
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Download,
  Search,
  Filter,
  MapPin,
  Truck,
  Clock
} from 'lucide-react';

import { 
  slaRuleSchema,
  SlaRule,
  RegionCode,
  Carrier,
  regionLabels,
  carrierOptions
} from '../../schemas/shippingEstimate';

interface SlaMatrixEditorProps {
  initialRules?: SlaRule[];
  onRulesChange?: (rules: SlaRule[]) => void;
  disabled?: boolean;
}

interface SlaRuleFormData {
  scope: {
    postalPattern?: string;
    il?: string;
    ilce?: string;
    region?: RegionCode;
  };
  carrier: Carrier;
  transitMin: number;
  transitMax: number;
  remoteAreaFactor?: number;
}

export function SlaMatrixEditor({ 
  initialRules = [], 
  onRulesChange,
  disabled = false 
}: SlaMatrixEditorProps) {
  const [rules, setRules] = useState<SlaRule[]>(initialRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarrier, setFilterCarrier] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SlaRule | null>(null);

  const form = useForm<SlaRuleFormData>({
    resolver: zodResolver(slaRuleSchema),
    defaultValues: {
      scope: {},
      carrier: 'Yurtiçi',
      transitMin: 1,
      transitMax: 2,
      remoteAreaFactor: 1.0
    }
  });

  // Filtrelenmiş kurallar
  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rule.scope.il && rule.scope.il.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rule.scope.ilce && rule.scope.ilce.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rule.scope.postalPattern && rule.scope.postalPattern.includes(searchTerm));
    
    const matchesCarrier = filterCarrier === 'all' || rule.carrier === filterCarrier;
    const matchesRegion = filterRegion === 'all' || rule.scope.region === filterRegion;
    
    return matchesSearch && matchesCarrier && matchesRegion;
  });

  // Kural ekleme/düzenleme
  const handleSubmit = (data: SlaRuleFormData) => {
    const newRule: SlaRule = {
      scope: data.scope,
      carrier: data.carrier,
      transitMin: data.transitMin,
      transitMax: data.transitMax,
      remoteAreaFactor: data.remoteAreaFactor
    };

    if (editingRule) {
      // Düzenleme
      const updatedRules = rules.map(rule => 
        rule === editingRule ? newRule : rule
      );
      setRules(updatedRules);
      onRulesChange?.(updatedRules);
    } else {
      // Ekleme
      const updatedRules = [...rules, newRule];
      setRules(updatedRules);
      onRulesChange?.(updatedRules);
    }

    setEditDialogOpen(false);
    setEditingRule(null);
    form.reset();
  };

  // Kural silme
  const handleDelete = (ruleToDelete: SlaRule) => {
    const updatedRules = rules.filter(rule => rule !== ruleToDelete);
    setRules(updatedRules);
    onRulesChange?.(updatedRules);
  };

  // Düzenleme başlatma
  const handleEdit = (rule: SlaRule) => {
    setEditingRule(rule);
    form.reset({
      scope: rule.scope,
      carrier: rule.carrier,
      transitMin: rule.transitMin,
      transitMax: rule.transitMax,
      remoteAreaFactor: rule.remoteAreaFactor
    });
    setEditDialogOpen(true);
  };

  // Yeni kural ekleme
  const handleAdd = () => {
    setEditingRule(null);
    form.reset();
    setEditDialogOpen(true);
  };

  // CSV İçe Aktarma (mock)
  const handleImport = () => {
    // CSV import logic would go here
    console.log('CSV import triggered');
  };

  // CSV Dışa Aktarma (mock)
  const handleExport = () => {
    const csvContent = [
      'Scope Type,Scope Value,Carrier,Transit Min,Transit Max,Remote Area Factor',
      ...rules.map(rule => {
        const scopeType = rule.scope.postalPattern ? 'postal' : 
                         rule.scope.ilce ? 'ilce' : 
                         rule.scope.il ? 'il' : 'region';
        const scopeValue = rule.scope.postalPattern || rule.scope.ilce || 
                          rule.scope.il || rule.scope.region || '';
        return `${scopeType},${scopeValue},${rule.carrier},${rule.transitMin},${rule.transitMax},${rule.remoteAreaFactor || 1.0}`;
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sla-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header ve İstatistikler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                SLA Matris Yönetimi
              </CardTitle>
              <CardDescription>
                Bölge ve taşıyıcı bazlı teslimat sürelerini yönetin
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                disabled={disabled}
              >
                <Upload className="w-4 h-4 mr-2" />
                İçe Aktar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={disabled}
              >
                <Download className="w-4 h-4 mr-2" />
                Dışa Aktar
              </Button>
              <Button
                onClick={handleAdd}
                disabled={disabled}
              >
                <Plus className="w-4 h-4 mr-2" />
                Kural Ekle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{rules.length}</div>
              <div className="text-sm text-blue-700">Toplam Kural</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {new Set(rules.map(r => r.carrier)).size}
              </div>
              <div className="text-sm text-green-700">Taşıyıcı</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {new Set(rules.map(r => r.scope.region).filter(Boolean)).size}
              </div>
              <div className="text-sm text-orange-700">Bölge</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(rules.reduce((acc, r) => acc + (r.transitMin + r.transitMax) / 2, 0) / rules.length || 0)}
              </div>
              <div className="text-sm text-purple-700">Ort. Süre (gün)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtreler */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Taşıyıcı, il, ilçe veya posta kodu ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={filterCarrier} onValueChange={setFilterCarrier}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Taşıyıcı" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Taşıyıcılar</SelectItem>
                  {carrierOptions.map(carrier => (
                    <SelectItem key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Bölge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Bölgeler</SelectItem>
                  {Object.entries(regionLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Kuralları Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Kuralları ({filteredRules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kapsam</TableHead>
                  <TableHead>Taşıyıcı</TableHead>
                  <TableHead>Transit Süre</TableHead>
                  <TableHead>Uzak Bölge</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        {rule.scope.postalPattern && (
                          <Badge variant="outline" className="text-xs">
                            📮 {rule.scope.postalPattern}
                          </Badge>
                        )}
                        {rule.scope.ilce && (
                          <Badge variant="outline" className="text-xs">
                            🏘️ {rule.scope.ilce}
                          </Badge>
                        )}
                        {rule.scope.il && (
                          <Badge variant="outline" className="text-xs">
                            🏙️ {rule.scope.il}
                          </Badge>
                        )}
                        {rule.scope.region && (
                          <Badge variant="outline" className="text-xs">
                            🌍 {regionLabels[rule.scope.region]}
                          </Badge>
                        )}
                        {!rule.scope.postalPattern && !rule.scope.ilce && !rule.scope.il && !rule.scope.region && (
                          <Badge variant="secondary" className="text-xs">
                            Genel
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{rule.carrier}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{rule.transitMin}-{rule.transitMax} gün</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {rule.remoteAreaFactor && rule.remoteAreaFactor > 1.0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {rule.remoteAreaFactor}x
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                          disabled={disabled}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={disabled}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Kuralı Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu SLA kuralını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(rule)}>
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
                
                {filteredRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm || filterCarrier !== 'all' || filterRegion !== 'all' 
                        ? 'Filtre kriterlerinize uygun kural bulunamadı'
                        : 'Henüz SLA kuralı eklenmemiş'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Kural Ekleme/Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'SLA Kuralını Düzenle' : 'Yeni SLA Kuralı Ekle'}
            </DialogTitle>
            <DialogDescription>
              Bölge ve taşıyıcı bazlı teslimat sürelerini tanımlayın
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="scope" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scope">Kapsam</TabsTrigger>
                  <TabsTrigger value="carrier">Taşıyıcı</TabsTrigger>
                  <TabsTrigger value="timing">Süreler</TabsTrigger>
                </TabsList>

                <TabsContent value="scope" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scope.postalPattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu Deseni</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: 34*, 06*"
                              {...field}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Belirli posta kodları için (opsiyonel)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scope.ilce"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlçe</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: Kadıköy, Çankaya"
                              {...field}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Belirli ilçeler için (opsiyonel)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scope.il"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İl</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: İstanbul, Ankara"
                              {...field}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            Belirli iller için (opsiyonel)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scope.region"
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
                                <SelectValue placeholder="Bölge seçin" />
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
                          <FormDescription>
                            Geniş bölge tanımı (opsiyonel)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="carrier" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="carrier"
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
                              {carrierOptions.map(carrier => (
                                <SelectItem key={carrier.value} value={carrier.value}>
                                  {carrier.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Bu kuralın geçerli olduğu taşıyıcı
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="timing" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="transitMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Transit (Gün)</FormLabel>
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
                      name="transitMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maksimum Transit (Gün)</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="remoteAreaFactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uzak Bölge Çarpanı</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1.0"
                            max="3.0"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormDescription>
                          1.0 = Normal, 1.5 = %50 daha uzun, 2.0 = %100 daha uzun
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={disabled}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={disabled}
                >
                  {editingRule ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
