'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  TruckIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import AdminProtection from '../../../components/AdminProtection';

interface InventoryData {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  categories: Array<{
    id: string;
      name: string;
    count: number;
    value: number;
  }>;
  lowStockProducts: Array<{
  id: string;
  name: string;
    currentStock: number;
    minStock: number;
    category: string;
  price: number;
  }>;
  recentMovements: Array<{
  id: string;
    productName: string;
    type: 'in' | 'out';
  quantity: number;
    timestamp: string;
  reason: string;
  }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddStock, setShowAddStock] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Simüle edilmiş envanter verisi
    const mockData: InventoryData = {
      totalProducts: 1247,
      lowStockItems: 23,
      outOfStockItems: 5,
      totalValue: 2456800,
      categories: [
        { id: '1', name: 'Elektronik', count: 456, value: 1200000 },
        { id: '2', name: 'Giyim', count: 234, value: 456000 },
        { id: '3', name: 'Ev & Yaşam', count: 189, value: 234000 },
        { id: '4', name: 'Spor', count: 156, value: 189000 },
        { id: '5', name: 'Kitap', count: 212, value: 378800 }
      ],
      lowStockProducts: [
        { id: '1', name: 'iPhone 15 Pro', currentStock: 2, minStock: 10, category: 'Elektronik', price: 45000 },
        { id: '2', name: 'Nike Air Max', currentStock: 3, minStock: 15, category: 'Spor', price: 2500 },
        { id: '3', name: 'Samsung Galaxy S24', currentStock: 1, minStock: 8, category: 'Elektronik', price: 35000 },
        { id: '4', name: 'Adidas T-Shirt', currentStock: 4, minStock: 20, category: 'Giyim', price: 350 },
        { id: '5', name: 'MacBook Pro', currentStock: 0, minStock: 5, category: 'Elektronik', price: 85000 }
      ],
      recentMovements: [
        { id: '1', productName: 'iPhone 15 Pro', type: 'out', quantity: 3, timestamp: '2 saat önce', reason: 'Satış' },
        { id: '2', productName: 'Samsung Galaxy S24', type: 'in', quantity: 10, timestamp: '4 saat önce', reason: 'Tedarik' },
        { id: '3', productName: 'Nike Air Max', type: 'out', quantity: 2, timestamp: '6 saat önce', reason: 'Satış' },
        { id: '4', productName: 'MacBook Pro', type: 'out', quantity: 1, timestamp: '8 saat önce', reason: 'Satış' },
        { id: '5', productName: 'Adidas T-Shirt', type: 'in', quantity: 50, timestamp: '1 gün önce', reason: 'Tedarik' }
      ],
      topSellingProducts: [
        { id: '1', name: 'iPhone 15 Pro', sales: 45, revenue: 2025000 },
        { id: '2', name: 'Samsung Galaxy S24', sales: 38, revenue: 1330000 },
        { id: '3', name: 'Nike Air Max', sales: 67, revenue: 167500 },
        { id: '4', name: 'Adidas T-Shirt', sales: 89, revenue: 31150 },
        { id: '5', name: 'MacBook Pro', sales: 12, revenue: 1020000 }
      ]
    };

    setTimeout(() => {
      setInventoryData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Envanter Yönetimi</h1>
              <p className="text-gray-600">Stok durumunu takip edin ve envanter işlemlerini yönetin</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddStock(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
                <PlusIcon className="h-4 w-4 mr-2" />
              Stok Ekle
            </button>
            <button
                onClick={() => setShowAdjustStock(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <MinusIcon className="h-4 w-4 mr-2" />
                Stok Düzenle
            </button>
          </div>
        </div>
          </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'low-stock', label: 'Düşük Stok' },
              { id: 'movements', label: 'Hareketler' },
              { id: 'analytics', label: 'Analiz' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                <CubeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryData?.totalProducts.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryData?.lowStockItems}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stok Tükendi</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryData?.outOfStockItems}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                <p className="text-2xl font-bold text-gray-900">₺{inventoryData?.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
              <div className="space-y-4">
                {inventoryData?.categories.map((category, index) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{category.count} ürün</div>
                      <div className="text-sm text-gray-600">₺{category.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
              <div className="space-y-4">
                {inventoryData?.topSellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} satış</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₺{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">gelir</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            )}

        {selectedTab === 'low-stock' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Düşük Stok Ürünleri</h3>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <TruckIcon className="h-4 w-4 inline mr-2" />
                Toplu Sipariş
              </button>
            </div>
            
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ürün
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mevcut Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min. Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryData?.lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.minStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.currentStock === 0 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.currentStock === 0 ? 'Stok Tükendi' : 'Düşük Stok'}
                          </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Sipariş Ver</button>
                        <button className="text-green-600 hover:text-green-900">Stok Ekle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
              </div>
            )}

        {selectedTab === 'movements' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Stok Hareketleri</h3>
            <div className="space-y-4">
              {inventoryData?.recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{movement.productName}</p>
                      <div className="flex items-center">
                        {movement.type === 'in' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`font-medium ${
                          movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{movement.reason} • {movement.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}

        {selectedTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stok Trendi</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Grafik verisi yükleniyor...</p>
                </div>
          </div>
        </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Performansı</h3>
              <div className="space-y-4">
                {inventoryData?.categories.map((category, index) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{category.count} ürün</div>
                      <div className="text-sm text-gray-600">₺{category.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Stock Modal */}
        {showAddStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok Ekle</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Seçin</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Ürün seçin</option>
                    <option value="1">iPhone 15 Pro</option>
                    <option value="2">Samsung Galaxy S24</option>
                    <option value="3">Nike Air Max</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Miktar girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Stok ekleme sebebi"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Stok Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStock(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Adjust Stock Modal */}
        {showAdjustStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok Düzenle</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Seçin</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Ürün seçin</option>
                    <option value="1">iPhone 15 Pro</option>
                    <option value="2">Samsung Galaxy S24</option>
                    <option value="3">Nike Air Max</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Stok Miktarı</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Yeni miktar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Stok düzenleme sebebi"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Stok Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdjustStock(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminProtection>
  );
}