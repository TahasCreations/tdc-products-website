"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package, Download, Calendar, BarChart3 } from 'lucide-react';

interface SalesReport {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  dailyData: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ title: string; category: string; quantity: number; revenue: number }>;
  paymentMethods: Array<{ method: string; count: number; revenue: number }>;
}

interface FinancialReport {
  summary: {
    totalRevenue: number;
    totalPayouts: number;
    totalRefunds: number;
    totalDiscounts: number;
    netRevenue: number;
    profit: number;
  };
  revenueByMethod: Array<{ method: string; amount: number }>;
  dailyBreakdown: Array<{ date: string; revenue: number; payouts: number; refunds: number; discounts: number; net: number }>;
}

interface ProductReport {
  topProducts: Array<{
    productId: string;
    title: string;
    category: string;
    totalSold: number;
    totalRevenue: number;
    averagePrice: number;
    currentStock: number;
    orderCount: number;
  }>;
  categoryStats: Array<{ category: string; revenue: number; quantity: number; productCount: number }>;
  lowStockProducts: Array<{ id: string; title: string; category: string; stock: number; lowStockThreshold: number }>;
  outOfStockProducts: Array<{ id: string; title: string; category: string; stock: number }>;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'financial' | 'products'>('sales');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [productReport, setProductReport] = useState<ProductReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, [activeTab, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });

      if (activeTab === 'sales') {
        const response = await fetch(`/api/admin/reports/sales?${params.toString()}`);
        const data = await response.json();
        if (data.success) setSalesReport(data);
      } else if (activeTab === 'financial') {
        const response = await fetch(`/api/admin/reports/financial?${params.toString()}`);
        const data = await response.json();
        if (data.success) setFinancialReport(data);
      } else if (activeTab === 'products') {
        const response = await fetch(`/api/admin/reports/products?${params.toString()}`);
        const data = await response.json();
        if (data.success) setProductReport(data);
      }
    } catch (error) {
      console.error('Rapor yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    // TODO: Implement CSV/Excel export
    alert('Export özelliği yakında eklenecek');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => handleExport(activeTab)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'sales', label: 'Satış Raporları', icon: ShoppingCart },
              { key: 'financial', label: 'Finansal Raporlar', icon: DollarSign },
              { key: 'products', label: 'Ürün Raporları', icon: Package },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Sales Report */}
              {activeTab === 'sales' && salesReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Toplam Gelir</div>
                      <div className="text-2xl font-bold text-blue-900">
                        ₺{salesReport.summary.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Toplam Sipariş</div>
                      <div className="text-2xl font-bold text-green-900">{salesReport.summary.totalOrders}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600 mb-1">Ortalama Sipariş Değeri</div>
                      <div className="text-2xl font-bold text-purple-900">
                        ₺{salesReport.summary.averageOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">En Çok Satan Ürünler</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ürün</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Kategori</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Adet</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Gelir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {salesReport.topProducts.map((product, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm">{product.title}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{product.category}</td>
                              <td className="px-4 py-2 text-sm text-right">{product.quantity}</td>
                              <td className="px-4 py-2 text-sm text-right font-medium">
                                ₺{product.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">Ödeme Yöntemleri</h3>
                    <div className="space-y-2">
                      {salesReport.paymentMethods.map((method, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{method.method === 'credit' ? 'Kredi Kartı' : method.method === 'bank' ? 'Havale/EFT' : method.method}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{method.count} sipariş</span>
                            <span className="font-semibold">₺{method.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Report */}
              {activeTab === 'financial' && financialReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Net Gelir</div>
                      <div className="text-2xl font-bold text-green-900">
                        ₺{financialReport.summary.netRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Toplam Gelir</div>
                      <div className="text-2xl font-bold text-blue-900">
                        ₺{financialReport.summary.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600 mb-1">Kar</div>
                      <div className="text-2xl font-bold text-purple-900">
                        ₺{financialReport.summary.profit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-600 mb-1">Toplam Ödemeler</div>
                      <div className="text-xl font-bold text-orange-900">
                        ₺{financialReport.summary.totalPayouts.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-sm text-red-600 mb-1">Toplam İadeler</div>
                      <div className="text-xl font-bold text-red-900">
                        ₺{financialReport.summary.totalRefunds.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="text-sm text-yellow-600 mb-1">Toplam İndirimler</div>
                      <div className="text-xl font-bold text-yellow-900">
                        ₺{financialReport.summary.totalDiscounts.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Report */}
              {activeTab === 'products' && productReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-4">En Çok Satan Ürünler</h3>
                      <div className="space-y-2">
                        {productReport.topProducts.slice(0, 10).map((product, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{product.title}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₺{product.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                              <div className="text-xs text-gray-500">{product.totalSold} adet</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-4">Kategori Performansı</h3>
                      <div className="space-y-2">
                        {productReport.categoryStats.map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{stat.category}</div>
                              <div className="text-xs text-gray-500">{stat.productCount} ürün</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₺{stat.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                              <div className="text-xs text-gray-500">{stat.quantity} adet</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-4 text-orange-600">Düşük Stoklu Ürünler</h3>
                      <div className="space-y-2">
                        {productReport.lowStockProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{product.title}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-orange-600">{product.stock} adet</div>
                              <div className="text-xs text-gray-500">Eşik: {product.lowStockThreshold}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-4 text-red-600">Stokta Olmayan Ürünler</h3>
                      <div className="space-y-2">
                        {productReport.outOfStockProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{product.title}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-red-600">0 adet</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
