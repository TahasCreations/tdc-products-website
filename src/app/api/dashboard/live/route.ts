import { NextRequest, NextResponse } from 'next/server';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  category: string;
  timestamp: string;
  status: 'good' | 'warning' | 'critical';
}

interface LiveActivity {
  id: string;
  type: 'order' | 'user' | 'payment' | 'inventory' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  value?: number;
  status: 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
}

interface LiveNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// Simulate real-time data
function generateLiveMetrics(): LiveMetric[] {
  const now = new Date();
  const baseTime = now.getTime();
  
  return [
    {
      id: '1',
      name: 'Aktif Kullanıcılar',
      value: Math.floor(Math.random() * 100) + 150,
      previousValue: 180,
      change: 0,
      changePercent: 0,
      trend: 'up',
      unit: 'kişi',
      category: 'Traffic',
      timestamp: now.toISOString(),
      status: 'good'
    },
    {
      id: '2',
      name: 'Anlık Satış',
      value: Math.floor(Math.random() * 5000) + 10000,
      previousValue: 12000,
      change: 0,
      changePercent: 0,
      trend: 'up',
      unit: 'TL',
      category: 'Sales',
      timestamp: now.toISOString(),
      status: 'good'
    },
    {
      id: '3',
      name: 'Sipariş Sayısı',
      value: Math.floor(Math.random() * 20) + 5,
      previousValue: 8,
      change: 0,
      changePercent: 0,
      trend: 'up',
      unit: 'adet',
      category: 'Orders',
      timestamp: now.toISOString(),
      status: 'good'
    },
    {
      id: '4',
      name: 'Dönüşüm Oranı',
      value: Math.round((Math.random() * 2 + 2) * 100) / 100,
      previousValue: 3.2,
      change: 0,
      changePercent: 0,
      trend: 'stable',
      unit: '%',
      category: 'Conversion',
      timestamp: now.toISOString(),
      status: 'good'
    },
    {
      id: '5',
      name: 'Ortalama Sepet Değeri',
      value: Math.floor(Math.random() * 200) + 300,
      previousValue: 350,
      change: 0,
      changePercent: 0,
      trend: 'down',
      unit: 'TL',
      category: 'Sales',
      timestamp: now.toISOString(),
      status: 'warning'
    },
    {
      id: '6',
      name: 'Sunucu Yükü',
      value: Math.round((Math.random() * 30 + 40) * 100) / 100,
      previousValue: 45,
      change: 0,
      changePercent: 0,
      trend: 'up',
      unit: '%',
      category: 'System',
      timestamp: now.toISOString(),
      status: 'good'
    }
  ];
}

function generateLiveActivities(): LiveActivity[] {
  const now = new Date();
  const activities: LiveActivity[] = [];
  
  const activityTypes = [
    { type: 'order', title: 'Yeni Sipariş', description: 'Sipariş #12345 oluşturuldu', status: 'success' },
    { type: 'user', title: 'Yeni Kullanıcı', description: 'Yeni kullanıcı kaydı', status: 'success' },
    { type: 'payment', title: 'Ödeme Alındı', description: '2,500 TL ödeme işlendi', status: 'success' },
    { type: 'inventory', title: 'Stok Uyarısı', description: 'Ürün stokta azaldı', status: 'warning' },
    { type: 'system', title: 'Sistem Güncellemesi', description: 'Güvenlik güncellemesi yapıldı', status: 'success' }
  ];

  for (let i = 0; i < 10; i++) {
    const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const timestamp = new Date(now.getTime() - Math.random() * 3600000); // Last hour
    
    activities.push({
      id: (i + 1).toString(),
      type: activity.type as any,
      title: activity.title,
      description: activity.description,
      timestamp: timestamp.toISOString(),
      user: Math.random() > 0.5 ? 'Admin User' : undefined,
      value: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 100 : undefined,
      status: activity.status as any,
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateLiveNotifications(): LiveNotification[] {
  const now = new Date();
  const notifications: LiveNotification[] = [];
  
  const notificationTypes = [
    { type: 'info', title: 'Sistem Bildirimi', message: 'Yeni güncelleme mevcut', priority: 'low' },
    { type: 'warning', title: 'Stok Uyarısı', message: '5 ürün stokta azaldı', priority: 'medium' },
    { type: 'error', title: 'Hata Bildirimi', message: 'Ödeme sistemi geçici olarak kullanılamıyor', priority: 'high' },
    { type: 'success', title: 'Başarılı İşlem', message: 'Yedekleme tamamlandı', priority: 'low' }
  ];

  for (let i = 0; i < 5; i++) {
    const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const timestamp = new Date(now.getTime() - Math.random() * 7200000); // Last 2 hours
    
    notifications.push({
      id: (i + 1).toString(),
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      timestamp: timestamp.toISOString(),
      isRead: Math.random() > 0.6,
      actionUrl: Math.random() > 0.5 ? '/admin/orders' : undefined,
      priority: notification.priority as any
    });
  }

  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    switch (type) {
      case 'metrics':
        const metrics = generateLiveMetrics();
        return NextResponse.json({
          success: true,
          data: {
            metrics,
            lastUpdated: new Date().toISOString(),
            total: metrics.length
          }
        });

      case 'activities':
        const activities = generateLiveActivities();
        return NextResponse.json({
          success: true,
          data: {
            activities: activities.slice(0, limit),
            total: activities.length,
            lastUpdated: new Date().toISOString()
          }
        });

      case 'notifications':
        const notifications = generateLiveNotifications();
        return NextResponse.json({
          success: true,
          data: {
            notifications: notifications.slice(0, limit),
            total: notifications.length,
            unread: notifications.filter(n => !n.isRead).length,
            lastUpdated: new Date().toISOString()
          }
        });

      default:
        // Return all data
        const allMetrics = generateLiveMetrics();
        const allActivities = generateLiveActivities();
        const allNotifications = generateLiveNotifications();

        return NextResponse.json({
          success: true,
          data: {
            metrics: allMetrics,
            activities: allActivities.slice(0, 5),
            notifications: allNotifications.slice(0, 3),
            summary: {
              totalUsers: allMetrics.find(m => m.id === '1')?.value || 0,
              totalSales: allMetrics.find(m => m.id === '2')?.value || 0,
              totalOrders: allMetrics.find(m => m.id === '3')?.value || 0,
              conversionRate: allMetrics.find(m => m.id === '4')?.value || 0,
              serverLoad: allMetrics.find(m => m.id === '6')?.value || 0
            },
            lastUpdated: new Date().toISOString()
          }
        });
    }

  } catch (error) {
    console.error('Live Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Canlı dashboard verileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationId } = body;

    switch (action) {
      case 'mark_notification_read':
        // In a real app, this would update the database
        return NextResponse.json({
          success: true,
          message: 'Bildirim okundu olarak işaretlendi'
        });

      case 'clear_notifications':
        return NextResponse.json({
          success: true,
          message: 'Tüm bildirimler temizlendi'
        });

      case 'refresh_data':
        // Simulate data refresh
        const metrics = generateLiveMetrics();
        const activities = generateLiveActivities();
        const notifications = generateLiveNotifications();

        return NextResponse.json({
          success: true,
          data: {
            metrics,
            activities: activities.slice(0, 5),
            notifications: notifications.slice(0, 3),
            lastUpdated: new Date().toISOString()
          },
          message: 'Veriler başarıyla yenilendi'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Live Dashboard Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
