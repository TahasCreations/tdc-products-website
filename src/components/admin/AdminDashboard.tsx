'use client';

import { StatCard, DailyOrdersChart, DailySalesChart, AnalyticsTable } from '../AnalyticsCharts';

interface AdminDashboardProps {
  orders: any[];
  products: any[];
  customers: any[];
  categories: any[];
}

export default function AdminDashboard({ orders, products, customers, categories }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Sipariş"
          value={orders.length}
          icon="ri-shopping-cart-line"
          color="blue"
        />
        <StatCard
          title="Toplam Ürün"
          value={products.length}
          icon="ri-shopping-bag-line"
          color="green"
        />
        <StatCard
          title="Toplam Müşteri"
          value={customers.length}
          icon="ri-user-line"
          color="purple"
        />
        <StatCard
          title="Toplam Kategori"
          value={categories.length}
          icon="ri-folder-line"
          color="orange"
        />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Siparişler</h3>
          <DailyOrdersChart data={orders} title="Günlük Siparişler" />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Satışlar</h3>
          <DailySalesChart data={orders} title="Günlük Satışlar" />
        </div>
      </div>

      {/* Analitik Tablosu */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detaylı Analitik</h3>
        </div>
        <AnalyticsTable 
          title="Detaylı Analitik"
          data={orders}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'status', label: 'Durum' },
            { key: 'total_amount', label: 'Tutar' },
            { key: 'created_at', label: 'Tarih' }
          ]}
        />
      </div>
    </div>
  );
}
