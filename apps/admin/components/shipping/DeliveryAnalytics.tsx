'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

// Mock data - gerçek uygulamada API'den gelecek
const mockAnalytics = {
  kpis: {
    accuracyRate: 87.5,
    avgDeliveryTime: 2.3,
    onTimeRate: 92.1,
    customerSatisfaction: 4.7
  },
  trends: [
    { month: 'Ocak', estimated: 2.1, actual: 2.0, accuracy: 95.2 },
    { month: 'Şubat', estimated: 2.2, actual: 2.1, accuracy: 95.5 },
    { month: 'Mart', estimated: 2.3, actual: 2.4, accuracy: 95.7 },
    { month: 'Nisan', estimated: 2.4, actual: 2.3, accuracy: 95.8 },
    { month: 'Mayıs', estimated: 2.5, actual: 2.6, accuracy: 96.0 },
    { month: 'Haziran', estimated: 2.3, actual: 2.2, accuracy: 95.7 }
  ],
  heatmap: [
    { region: 'İstanbul', accuracy: 94.2, avgTime: 1.8, orders: 1250 },
    { region: 'Ankara', accuracy: 96.1, avgTime: 2.1, orders: 890 },
    { region: 'İzmir', accuracy: 95.8, avgTime: 2.0, orders: 756 },
    { region: 'Bursa', accuracy: 93.5, avgTime: 2.3, orders: 432 },
    { region: 'Antalya', accuracy: 92.8, avgTime: 2.5, orders: 389 },
    { region: 'Adana', accuracy: 91.2, avgTime: 2.7, orders: 234 }
  ],
  alerts: [
    { type: 'warning', message: 'Bursa bölgesinde tahmin doğruluğu %93.5\'in altında', priority: 'medium' },
    { type: 'info', message: 'El yapımı ürünlerde ortalama teslimat süresi 0.3 gün arttı', priority: 'low' },
    { type: 'error', message: 'Hafta sonu sevkiyatlarında gecikme riski tespit edildi', priority: 'high' }
  ],
  calibrations: [
    { date: '2024-01-15', type: 'Automatic', improvement: '+2.3%', status: 'success' },
    { date: '2024-01-10', type: 'Manual', improvement: '+1.8%', status: 'success' },
    { date: '2024-01-05', type: 'Automatic', improvement: '+0.9%', status: 'success' }
  ]
};

interface DeliveryAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  region?: string;
  onTimeRangeChange?: (range: string) => void;
  onRegionChange?: (region: string) => void;
  onCalibrate?: () => void;
  disabled?: boolean;
}

export function DeliveryAnalytics({ 
  timeRange = '30d',
  region = 'all',
  onTimeRangeChange,
  onRegionChange,
  onCalibrate,
  disabled = false 
}: DeliveryAnalyticsProps) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  // Kalibrasyon simülasyonu
  const handleCalibrate = async () => {
    setIsCalibrating(true);
    // Gerçek uygulamada API çağrısı yapılacak
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCalibrating(false);
    if (onCalibrate) {
      onCalibrate();
    }
  };

  // KPI kartları
  const kpiCards = [
    {
      title: 'Tahmin Doğruluğu',
      value: `${mockAnalytics.kpis.accuracyRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ortalama Teslimat',
      value: `${mockAnalytics.kpis.avgDeliveryTime} gün`,
      change: '-0.2 gün',
      trend: 'down',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Zamanında Teslimat',
      value: `${mockAnalytics.kpis.onTimeRate}%`,
      change: '+1.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Müşteri Memnuniyeti',
      value: `${mockAnalytics.kpis.customerSatisfaction}/5`,
      change: '+0.1',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header ve Filtreler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Teslimat Analitikleri
              </CardTitle>
              <CardDescription>
                ETA tahmin doğruluğunu ve teslimat performansını analiz edin
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Gün</SelectItem>
                  <SelectItem value="30d">30 Gün</SelectItem>
                  <SelectItem value="90d">90 Gün</SelectItem>
                  <SelectItem value="1y">1 Yıl</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Bölgeler</SelectItem>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="izmir">İzmir</SelectItem>
                  <SelectItem value="other">Diğer</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleCalibrate}
                disabled={disabled || isCalibrating}
                size="sm"
              >
                {isCalibrating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Kalibre Ediliyor...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Modeli Kalibre Et
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                      <div className="flex items-center mt-2">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs önceki dönem</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Trend Grafiği */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Tahmin vs Gerçek Teslimat Süresi
          </CardTitle>
          <CardDescription>
            Aylık tahmin doğruluğu trendi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalytics.trends.map((trend, index) => (
              <motion.div
                key={trend.month}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-8 bg-blue-200 rounded-t" style={{ height: `${(trend.actual / 3) * 200}px` }} />
                <div className="w-8 bg-green-200 rounded-t" style={{ height: `${(trend.estimated / 3) * 200}px` }} />
                <div className="text-xs text-center">
                  <div className="font-medium">{trend.month}</div>
                  <div className="text-gray-500">{trend.accuracy.toFixed(1)}%</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded" />
              <span className="text-sm">Gerçek</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded" />
              <span className="text-sm">Tahmin</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bölge Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Bölgesel Performans Heatmap
          </CardTitle>
          <CardDescription>
            Bölge bazında tahmin doğruluğu ve teslimat süreleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAnalytics.heatmap.map((item, index) => (
              <motion.div
                key={item.region}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.region}</h4>
                  <Badge variant={item.accuracy >= 95 ? 'default' : item.accuracy >= 93 ? 'secondary' : 'destructive'}>
                    {item.accuracy.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Ortalama Süre:</span>
                    <span className="font-medium">{item.avgTime} gün</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sipariş Sayısı:</span>
                    <span className="font-medium">{item.orders.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uyarılar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Performans Uyarıları
          </CardTitle>
          <CardDescription>
            Dikkat edilmesi gereken alanlar ve öneriler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAnalytics.alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {alert.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge 
                        variant={alert.priority === 'high' ? 'destructive' : 
                                alert.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {alert.priority === 'high' ? 'Yüksek' : 
                         alert.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kalibrasyon Geçmişi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Model Kalibrasyon Geçmişi
          </CardTitle>
          <CardDescription>
            Son model güncellemeleri ve iyileştirmeler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.calibrations.map((calibration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    calibration.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(calibration.date).toLocaleDateString('tr-TR')} - {calibration.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Doğruluk iyileştirmesi: {calibration.improvement}
                    </p>
                  </div>
                </div>
                <Badge variant={calibration.status === 'success' ? 'default' : 'destructive'}>
                  {calibration.status === 'success' ? 'Başarılı' : 'Başarısız'}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Detaylı Rapor İndir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
