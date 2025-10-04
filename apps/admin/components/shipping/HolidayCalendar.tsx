'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Clock,
  Star,
  Gift,
  AlertTriangle
} from 'lucide-react';

import { 
  holidaySchema,
  Holiday,
  holidayTypes
} from '../../schemas/shippingEstimate';

interface HolidayCalendarProps {
  initialHolidays?: Holiday[];
  onHolidaysChange?: (holidays: Holiday[]) => void;
  disabled?: boolean;
}

interface HolidayFormData {
  name: string;
  date: string;
  type: 'resmi' | 'özel' | 'kampanya';
  isRecurring: boolean;
  capacityFactor: number;
  description?: string;
}

export function HolidayCalendar({ 
  initialHolidays = [], 
  onHolidaysChange,
  disabled = false 
}: HolidayCalendarProps) {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'resmi',
      isRecurring: false,
      capacityFactor: 1.0,
      description: ''
    }
  });

  // Takvim günleri
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Tarihe göre tatil bulma
  const getHolidayForDate = (date: Date) => {
    return holidays.find(holiday => 
      isSameDay(new Date(holiday.date), date)
    );
  };

  // Tatil ekleme/düzenleme
  const handleSubmit = (data: HolidayFormData) => {
    const newHoliday: Holiday = {
      ...data,
      capacityFactor: data.capacityFactor
    };

    if (editingHoliday) {
      // Düzenleme
      const updatedHolidays = holidays.map(holiday => 
        holiday.date === editingHoliday.date ? newHoliday : holiday
      );
      setHolidays(updatedHolidays);
      onHolidaysChange?.(updatedHolidays);
    } else {
      // Ekleme
      const updatedHolidays = [...holidays, newHoliday];
      setHolidays(updatedHolidays);
      onHolidaysChange?.(updatedHolidays);
    }

    setEditDialogOpen(false);
    setEditingHoliday(null);
    form.reset();
  };

  // Tatil silme
  const handleDelete = (holidayToDelete: Holiday) => {
    const updatedHolidays = holidays.filter(holiday => holiday.date !== holidayToDelete.date);
    setHolidays(updatedHolidays);
    onHolidaysChange?.(updatedHolidays);
  };

  // Düzenleme başlatma
  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    form.reset({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type as any,
      isRecurring: holiday.isRecurring,
      capacityFactor: holiday.capacityFactor,
      description: holiday.description
    });
    setEditDialogOpen(true);
  };

  // Yeni tatil ekleme
  const handleAdd = (date?: Date) => {
    setEditingHoliday(null);
    form.reset({
      name: '',
      date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      type: 'resmi',
      isRecurring: false,
      capacityFactor: 1.0,
      description: ''
    });
    setEditDialogOpen(true);
  };

  // Tarih seçimi
  const handleDateClick = (date: Date) => {
    const holiday = getHolidayForDate(date);
    if (holiday) {
      handleEdit(holiday);
    } else {
      setSelectedDate(date);
      handleAdd(date);
    }
  };

  // Ay değiştirme
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = addDays(currentMonth, direction === 'next' ? 31 : -31);
    setCurrentMonth(startOfMonth(newMonth));
  };

  // Tatil türü ikonu
  const getHolidayIcon = (type: string) => {
    switch (type) {
      case 'resmi':
        return <Star className="w-3 h-3" />;
      case 'özel':
        return <Gift className="w-3 h-3" />;
      case 'kampanya':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  // Tatil türü rengi
  const getHolidayColor = (type: string) => {
    switch (type) {
      case 'resmi':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'özel':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'kampanya':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Türk resmi tatilleri (örnek)
  const turkishHolidays = [
    { name: 'Yılbaşı', date: '2024-01-01', type: 'resmi' },
    { name: 'Ulusal Egemenlik ve Çocuk Bayramı', date: '2024-04-23', type: 'resmi' },
    { name: 'Emek ve Dayanışma Günü', date: '2024-05-01', type: 'resmi' },
    { name: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', date: '2024-05-19', type: 'resmi' },
    { name: 'Demokrasi ve Milli Birlik Günü', date: '2024-07-15', type: 'resmi' },
    { name: 'Zafer Bayramı', date: '2024-08-30', type: 'resmi' },
    { name: 'Cumhuriyet Bayramı', date: '2024-10-29', type: 'resmi' }
  ];

  // Türk tatillerini otomatik ekleme
  const handleAddTurkishHolidays = () => {
    const newHolidays = turkishHolidays.filter(holiday => 
      !holidays.find(h => h.date === holiday.date)
    ).map(holiday => ({
      ...holiday,
      isRecurring: true,
      capacityFactor: 1.0,
      description: 'Türkiye resmi tatili'
    }));

    const updatedHolidays = [...holidays, ...newHolidays];
    setHolidays(updatedHolidays);
    onHolidaysChange?.(updatedHolidays);
  };

  return (
    <div className="space-y-6">
      {/* Header ve İstatistikler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tatil Takvimi
              </CardTitle>
              <CardDescription>
                Resmi tatiller, özel günler ve kampanya günlerini yönetin
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTurkishHolidays}
                disabled={disabled}
              >
                <Star className="w-4 h-4 mr-2" />
                TR Tatilleri Ekle
              </Button>
              <Button
                onClick={() => handleAdd()}
                disabled={disabled}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tatil Ekle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">
                {holidays.filter(h => h.type === 'resmi').length}
              </div>
              <div className="text-sm text-red-700">Resmi Tatil</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {holidays.filter(h => h.type === 'özel').length}
              </div>
              <div className="text-sm text-purple-700">Özel Gün</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {holidays.filter(h => h.type === 'kampanya').length}
              </div>
              <div className="text-sm text-orange-700">Kampanya</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {holidays.filter(h => h.isRecurring).length}
              </div>
              <div className="text-sm text-green-700">Tekrarlayan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Takvim */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(currentMonth, 'MMMM yyyy', { locale: tr })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMonthChange('prev')}
                disabled={disabled}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMonthChange('next')}
                disabled={disabled}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Hafta günleri */}
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Takvim günleri */}
            {calendarDays.map((date, index) => {
              const holiday = getHolidayForDate(date);
              const isCurrentDay = isToday(date);
              
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  className={`
                    p-2 min-h-[60px] border rounded-lg cursor-pointer transition-all hover:bg-gray-50
                    ${isCurrentDay ? 'bg-blue-100 border-blue-300' : 'border-gray-200'}
                    ${holiday ? 'border-2' : ''}
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-900' : 'text-gray-900'}`}>
                      {format(date, 'd')}
                    </span>
                    {holiday && (
                      <div className={`p-1 rounded-full ${getHolidayColor(holiday.type)}`}>
                        {getHolidayIcon(holiday.type)}
                      </div>
                    )}
                  </div>
                  
                  {holiday && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-800 truncate">
                        {holiday.name}
                      </div>
                      {holiday.capacityFactor !== 1.0 && (
                        <Badge variant="secondary" className="text-xs">
                          {holiday.capacityFactor}x
                        </Badge>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tatil Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Tatil Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {holidays
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((holiday, index) => (
                <motion.div
                  key={holiday.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getHolidayColor(holiday.type)}`}>
                      {getHolidayIcon(holiday.type)}
                    </div>
                    <div>
                      <div className="font-medium">{holiday.name}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(holiday.date), 'dd MMMM yyyy', { locale: tr })}
                      </div>
                      {holiday.description && (
                        <div className="text-xs text-gray-600">{holiday.description}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {holidayTypes.find(t => t.value === holiday.type)?.label}
                    </Badge>
                    
                    {holiday.isRecurring && (
                      <Badge variant="secondary">Tekrarlayan</Badge>
                    )}
                    
                    {holiday.capacityFactor !== 1.0 && (
                      <Badge variant="destructive">
                        {holiday.capacityFactor}x
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(holiday)}
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
                            <AlertDialogTitle>Tatili Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{holiday.name}" tatilini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(holiday)}>
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            
            {holidays.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Henüz tatil eklenmemiş
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tatil Ekleme/Düzenleme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingHoliday ? 'Tatili Düzenle' : 'Yeni Tatil Ekle'}
            </DialogTitle>
            <DialogDescription>
              Tatil bilgilerini ve kapasite çarpanını tanımlayın
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tatil Adı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="örn: Yılbaşı, Black Friday"
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tatil Türü</FormLabel>
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
                          {holidayTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
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
                name="capacityFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapasite Çarpanı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      1.0 = Normal, 0.5 = %50 azalt, 2.0 = %100 artır
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Tekrarlayan Tatil
                      </FormLabel>
                      <FormDescription>
                        Her yıl aynı tarihte tekrarlansın
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kısa açıklama"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {editingHoliday ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
