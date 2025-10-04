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
  MapPin,
  Clock,
  Package,
  Truck,
  Warehouse as WarehouseIcon,
  Settings
} from 'lucide-react';

import { 
  warehouseSchema,
  Warehouse,
  ShippingEstimateConfig,
  defaultShippingConfig
} from '../../schemas/shippingEstimate';
import { 
  multiWarehousePlan,
  calculateAdvancedETA 
} from '../../lib/shipping/eta';

interface WarehouseRulesEditorProps {
  initialWarehouses?: Warehouse[];
  onWarehousesChange?: (warehouses: Warehouse[]) => void;
  disabled?: boolean;
}

interface WarehouseFormData {
  name: string;
  code: string;
  lat: number;
  lon: number;
  address: string;
  city: string;
  postalCode: string;
  cutoffHour: number;
  weekendDispatch: boolean;
  isActive: boolean;
}

interface InventoryItem {
  productId: string;
  variantId?: string;
  stock: number;
  reserved: number;
}

export function WarehouseRulesEditor({ 
  initialWarehouses = [], 
  onWarehousesChange,
  disabled = false 
}: WarehouseRulesEditorProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      code: '',
      lat: 0,
      lon: 0,
      address: '',
      city: '',
      postalCode: '',
      cutoffHour: 16,
      weekendDispatch: false,
      isActive: true
    }
  });

  // Depo ekleme/düzenleme
  const handleSubmit = (data: WarehouseFormData) => {
    const newWarehouse: Warehouse = {
      ...data,
      lat: data.lat,
      lon: data.lon
    };

    if (editingWarehouse) {
      // Düzenleme
      const updatedWarehouses = warehouses.map(warehouse => 
        warehouse.code === editingWarehouse.code ? newWarehouse : warehouse
      );
      setWarehouses(updatedWarehouses);
      onWarehousesChange?.(updatedWarehouses);
    } else {
      // Ekleme
      const updatedWarehouses = [...warehouses, newWarehouse];
      setWarehouses(updatedWarehouses);
      onWarehousesChange?.(updatedWarehouses);
    }

    setEditDialogOpen(false);
    setEditingWarehouse(null);
    form.reset();
  };

  // Depo silme
  const handleDelete = (warehouseToDelete: Warehouse) => {
    const updatedWarehouses = warehouses.filter(warehouse => warehouse.code !== warehouseToDelete.code);
    setWarehouses(updatedWarehouses);
    onWarehousesChange?.(updatedWarehouses);
  };

  // Düzenleme başlatma
  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    form.reset({
      name: warehouse.name,
      code: warehouse.code,
      lat: warehouse.lat,
      lon: warehouse.lon,
      address: warehouse.address,
      city: warehouse.city,
      postalCode: warehouse.postalCode,
      cutoffHour: warehouse.cutoffHour,
      weekendDispatch: warehouse.weekendDispatch,
      isActive: warehouse.isActive
    });
    setEditDialogOpen(true);
  };

  // Yeni depo ekleme
  const handleAdd = () => {
    setEditingWarehouse(null);
    form.reset();
    setEditDialogOpen(true);
  };

  // Stok yönetimi
  const handleManageInventory = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    // Mock inventory data
    setInventory([
      { productId: 'prod-1', stock: 50, reserved: 5 },
      { productId: 'prod-2', variantId: 'var-1', stock: 25, reserved: 2 },
      { productId: 'prod-3', stock: 0, reserved: 0 }
    ]);
    setInventoryDialogOpen(true);
  };

  // Çok depo planlama testi
  const handleTestMultiWarehouse = () => {
    if (warehouses.length === 0) return;
    
    const testItems = [
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-2', variantId: 'var-1', quantity: 1 },
      { productId: 'prod-3', quantity: 3 }
    ];

    const plan = multiWarehousePlan(testItems, warehouses, defaultShippingConfig);
    console.log('Multi-warehouse plan:', plan);
    alert(`Test tamamlandı! ${plan.totalPackages} paket planlandı.`);
  };

  return (
    <div className="space-y-6">
      {/* Header ve İstatistikler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <WarehouseIcon className="w-5 h-5" />
                Depo Yönetimi
              </CardTitle>
              <CardDescription>
                Depo konumları, cutoff saatleri ve stok yönetimi
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestMultiWarehouse}
                disabled={disabled || warehouses.length === 0}
              >
                <Package className="w-4 h-4 mr-2" />
                Çok Depo Testi
              </Button>
              <Button
                onClick={handleAdd}
                disabled={disabled}
              >
                <Plus className="w-4 h-4 mr-2" />
                Depo Ekle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{warehouses.length}</div>
              <div className="text-sm text-blue-700">Toplam Depo</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {warehouses.filter(w => w.isActive).length}
              </div>
              <div className="text-sm text-green-700">Aktif Depo</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {warehouses.filter(w => w.weekendDispatch).length}
              </div>
              <div className="text-sm text-orange-700">Hafta Sonu Sevkiyat</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(warehouses.reduce((acc, w) => acc + w.cutoffHour, 0) / warehouses.length || 0)}
              </div>
              <div className="text-sm text-purple-700">Ort. Cutoff Saati</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Depo Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Depo Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Depo</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Cutoff</TableHead>
                  <TableHead>Hafta Sonu</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse, index) => (
                  <motion.tr
                    key={warehouse.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{warehouse.name}</div>
                        <div className="text-sm text-gray-500">Kod: {warehouse.code}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm">{warehouse.city}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {warehouse.lat.toFixed(4)}, {warehouse.lon.toFixed(4)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-sm">{warehouse.cutoffHour}:00</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={warehouse.weekendDispatch ? 'default' : 'secondary'}>
                        {warehouse.weekendDispatch ? 'Açık' : 'Kapalı'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={warehouse.isActive ? 'default' : 'destructive'}>
                        {warehouse.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageInventory(warehouse)}
                          disabled={disabled}
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(warehouse)}
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
                              <AlertDialogTitle>Depoyu Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{warehouse.name}" deposunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(warehouse)}>
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
                
                {warehouses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Henüz depo eklenmemiş
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Depo Ekleme/Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Depoyu Düzenle' : 'Yeni Depo Ekle'}
            </DialogTitle>
            <DialogDescription>
              Depo bilgilerini ve cutoff ayarlarını tanımlayın
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                  <TabsTrigger value="location">Konum</TabsTrigger>
                  <TabsTrigger value="settings">Ayarlar</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Adı</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: İstanbul Merkez Depo"
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
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depo Kodu</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: IST-01"
                              {...field}
                              disabled={disabled || !!editingWarehouse}
                            />
                          </FormControl>
                          <FormDescription>
                            Benzersiz depo kodu (değiştirilemez)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tam adres bilgisi"
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şehir</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: İstanbul"
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
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posta Kodu</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="örn: 34000"
                              {...field}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enlem (Latitude)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.0001"
                              placeholder="örn: 41.0082"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            GPS koordinatı (örn: 41.0082)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Boylam (Longitude)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.0001"
                              placeholder="örn: 28.9784"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            GPS koordinatı (örn: 28.9784)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Harita Entegrasyonu</h4>
                    <p className="text-sm text-blue-800">
                      GPS koordinatlarını Google Maps'ten alabilirsiniz. 
                      Enlem ve boylam değerleri çok depo planlaması için kullanılır.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cutoffHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cutoff Saati</FormLabel>
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
                          Bu saatten sonraki siparişler ertesi güne sayılır
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="weekendDispatch"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Hafta Sonu Sevkiyat
                            </FormLabel>
                            <FormDescription>
                              Cumartesi ve Pazar günleri kargo gönderimi yapılır
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
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Aktif Depo
                            </FormLabel>
                            <FormDescription>
                              Bu depo sipariş tahsisi için kullanılır
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
                  {editingWarehouse ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Stok Yönetimi Dialog */}
      <Dialog open={inventoryDialogOpen} onOpenChange={setInventoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Stok Yönetimi - {selectedWarehouse?.name}
            </DialogTitle>
            <DialogDescription>
              Depo stok durumunu görüntüleyin ve yönetin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Varyant</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Rezerve</TableHead>
                    <TableHead>Müsait</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.productId}
                      </TableCell>
                      <TableCell>
                        {item.variantId || '-'}
                      </TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.reserved}</TableCell>
                      <TableCell>{item.stock - item.reserved}</TableCell>
                      <TableCell>
                        <Badge variant={item.stock > 0 ? 'default' : 'destructive'}>
                          {item.stock > 0 ? 'Stokta' : 'Tükendi'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setInventoryDialogOpen(false)}
              >
                Kapat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
