'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  warehouse: string;
  lastRestocked: string;
  demandForecast: number;
  turnoverRate: number;
  abcCategory: 'A' | 'B' | 'C';
  status: 'active' | 'inactive' | 'discontinued';
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  contact: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  reason: string;
  reference: string;
  timestamp: string;
  user: string;
  warehouse: string;
}

interface AIRecommendation {
  type: 'reorder' | 'reduce' | 'transfer' | 'discontinue';
  itemId: string;
  itemName: string;
  currentStock: number;
  recommendedAction: string;
  confidence: number;
  reasoning: string;
  impact: 'high' | 'medium' | 'low';
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export default function AdvancedInventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'ai'>('overview');
  const { addToast } = useToast();

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsResponse, warehousesResponse, movementsResponse, recommendationsResponse] = await Promise.all([
        fetch('/api/inventory/items'),
        fetch('/api/inventory/warehouses'),
        fetch('/api/inventory/movements'),
        fetch('/api/ai/inventory/recommendations')
      ]);

      const [items, warehouses, movements, recommendations] = await Promise.all([
        itemsResponse.json(),
        warehousesResponse.json(),
        movementsResponse.json(),
        recommendationsResponse.json()
      ]);

      setInventoryItems(items);
      setWarehouses(warehouses);
      setStockMovements(movements);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Inventory fetch error:', error);
      addToast({
        type: 'error',
        title: 'Stok Verisi Hatası',
        message: 'Stok verileri yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const generateAIRecommendations = async () => {
    try {
      const response = await fetch('/api/ai/inventory/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: inventoryItems,
          movements: stockMovements,
          warehouses: warehouses
        })
      });

      const recommendations = await response.json();
      setAiRecommendations(recommendations);
      
      addToast({
        type: 'success',
        title: 'AI Analizi Tamamlandı',
        message: `${recommendations.length} öneri oluşturuldu`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'AI Analiz Hatası',
        message: 'AI analizi tamamlanamadı'
      });
    }
  };

  const applyRecommendation = async (recommendation: AIRecommendation) => {
    try {
      const response = await fetch('/api/inventory/apply-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendation)
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Öneri Uygulandı',
          message: `${recommendation.itemName} için öneri uygulandı`
        });
        fetchInventoryData(); // Refresh data
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Uygulama Hatası',
        message: 'Öneri uygulanamadı'
      });
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const warehouseMatch = selectedWarehouse === 'all' || item.warehouse === selectedWarehouse;
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return warehouseMatch && categoryMatch;
  });

  const lowStockItems = filteredItems.filter(item => item.currentStock <= item.reorderPoint);
  const outOfStockItems = filteredItems.filter(item => item.currentStock === 0);
  const overstockedItems = filteredItems.filter(item => item.currentStock > item.maxStock);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getABCColor = (category: string) => {
    switch (category) {
      case 'A': return 'text-red-600 bg-red-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Stok verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-box-3-line text-3xl text-blue-600 mr-3"></i>
            Gelişmiş Stok Yönetimi
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={generateAIRecommendations}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-brain-line mr-2"></i>
              AI Analizi
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'overview', label: 'Genel Bakış', icon: 'ri-dashboard-line' },
            { key: 'detailed', label: 'Detaylı Görünüm', icon: 'ri-table-line' },
            { key: 'ai', label: 'AI Önerileri', icon: 'ri-brain-line' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`${mode.icon} mr-2`}></i>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depo Seçimi
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Depolar</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {[...new Set(inventoryItems.map(item => item.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedWarehouse('all');
                setSelectedCategory('all');
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-box-3-line text-2xl text-blue-600"></i>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {filteredItems.length} ürün
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {filteredItems.reduce((sum, item) => sum + item.currentStock, 0).toLocaleString('tr-TR')}
              </div>
              <div className="text-sm text-gray-600">Toplam Stok</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <i className="ri-alert-line text-2xl text-red-600"></i>
                </div>
                <div className="text-sm font-medium text-red-600">
                  Kritik
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {lowStockItems.length}
              </div>
              <div className="text-sm text-gray-600">Düşük Stok</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <i className="ri-close-circle-line text-2xl text-orange-600"></i>
                </div>
                <div className="text-sm font-medium text-orange-600">
                  Tükendi
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {outOfStockItems.length}
              </div>
              <div className="text-sm text-gray-600">Stokta Yok</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-trending-up-line text-2xl text-green-600"></i>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Fazla
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {overstockedItems.length}
              </div>
              <div className="text-sm text-gray-600">Fazla Stok</div>
            </div>
          </div>

          {/* Warehouse Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Depo Durumu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {warehouses.map((warehouse) => {
                const warehouseItems = inventoryItems.filter(item => item.warehouse === warehouse.id);
                const totalStock = warehouseItems.reduce((sum, item) => sum + item.currentStock, 0);
                const capacityPercentage = (warehouse.currentStock / warehouse.capacity) * 100;

                return (
                  <div key={warehouse.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        capacityPercentage > 90 ? 'bg-red-100 text-red-600' :
                        capacityPercentage > 70 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        %{capacityPercentage.toFixed(0)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Toplam Stok:</span>
                        <span className="font-medium">{totalStock.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kapasite:</span>
                        <span className="font-medium">{warehouse.capacity.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ürün Sayısı:</span>
                        <span className="font-medium">{warehouseItems.length}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            capacityPercentage > 90 ? 'bg-red-500' :
                            capacityPercentage > 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Detailed Mode */}
      {viewMode === 'detailed' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Detaylı Stok Listesi</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mevcut Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min/Max
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ABC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          item.currentStock <= item.reorderPoint ? 'text-red-600' :
                          item.currentStock > item.maxStock ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {item.currentStock}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">adet</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.minStock} / {item.maxStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getABCColor(item.abcCategory)}`}>
                        {item.abcCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warehouses.find(w => w.id === item.warehouse)?.name || item.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.currentStock <= item.reorderPoint ? 'bg-red-100 text-red-600' :
                        item.currentStock > item.maxStock ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.currentStock <= item.reorderPoint ? 'Düşük' :
                         item.currentStock > item.maxStock ? 'Fazla' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Recommendations Mode */}
      {viewMode === 'ai' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <i className="ri-brain-line text-2xl text-purple-600 mr-2"></i>
            AI Stok Önerileri
          </h3>
          
          {aiRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-brain-line text-6xl text-gray-300 mb-4"></i>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analizi Bekleniyor</h4>
              <p className="text-gray-600 mb-4">Stok verilerinizi analiz etmek için AI analizi başlatın</p>
              <button
                onClick={generateAIRecommendations}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                AI Analizi Başlat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        recommendation.type === 'reorder' ? 'bg-red-100' :
                        recommendation.type === 'reduce' ? 'bg-orange-100' :
                        recommendation.type === 'transfer' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <i className={`text-lg ${
                          recommendation.type === 'reorder' ? 'ri-add-box-line text-red-600' :
                          recommendation.type === 'reduce' ? 'ri-subtract-line text-orange-600' :
                          recommendation.type === 'transfer' ? 'ri-exchange-line text-blue-600' :
                          'ri-close-line text-gray-600'
                        }`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{recommendation.itemName}</h4>
                        <p className="text-sm text-gray-600">Mevcut Stok: {recommendation.currentStock}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recommendation.urgency)}`}>
                        {recommendation.urgency}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recommendation.impact)}`}>
                        {recommendation.impact}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        %{recommendation.confidence} güven
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Önerilen Aksiyon:</strong> {recommendation.recommendedAction}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>AI Açıklaması:</strong> {recommendation.reasoning}
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => applyRecommendation(recommendation)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Öneriyi Uygula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
