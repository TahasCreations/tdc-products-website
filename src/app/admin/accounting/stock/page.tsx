'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface StockItem {
  id: string;
  code: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  min_stock: number;
  max_stock: number;
  current_stock: number;
  avg_cost: number;
  last_cost: number;
  is_active: boolean;
  created_at: string;
}

interface StockTransaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'COUNT';
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference: string;
  description: string;
  stock_item_id: string;
  stock_item?: StockItem;
}

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'items' | 'transactions' | 'reports' | 'count'>('items');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni stok kartı formu state'leri
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    description: '',
    unit: 'ADET',
    category: '',
    min_stock: 0,
    max_stock: 0,
    is_active: true
  });

  // Yeni stok hareketi formu state'leri
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT' | 'COUNT',
    quantity: 0,
    unit_cost: 0,
    reference: '',
    description: '',
    stock_item_id: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStockItems(),
        fetchStockTransactions()
      ]);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchStockItems = async () => {
    try {
      const response = await fetch('/api/accounting/stock-items');
      if (!response.ok) throw new Error('Stok kartları alınamadı');
      const data = await response.json();
      setStockItems(data);
    } catch (error) {
      console.error('Stock items fetch error:', error);
    }
  };

  const fetchStockTransactions = async () => {
    try {
      const response = await fetch('/api/accounting/stock-transactions');
      if (!response.ok) throw new Error('Stok hareketleri alınamadı');
      const data = await response.json();
      setStockTransactions(data);
    } catch (error) {
      console.error('Stock transactions fetch error:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/accounting/stock-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Stok kartı eklenemedi');

      await fetchStockItems();
      setShowAddForm(false);
      setNewItem({
        code: '',
        name: '',
        description: '',
        unit: 'ADET',
        category: '',
        min_stock: 0,
        max_stock: 0,
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add item error:', error);
      setError('Stok kartı eklenirken hata oluştu');
    }
  };

  const handleAddTransaction = async () => {
    try {
      const response = await fetch('/api/accounting/stock-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error('Stok hareketi eklenemedi');

      await Promise.all([fetchStockItems(), fetchStockTransactions()]);
      setShowTransactionForm(false);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'IN',
        quantity: 0,
        unit_cost: 0,
        reference: '',
        description: '',
        stock_item_id: ''
      });
      setError('');
    } catch (error) {
      console.error('Add transaction error:', error);
      setError('Stok hareketi eklenirken hata oluştu');
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesType = filterType === 'ALL' || 
      (filterType === 'LOW_STOCK' && item.current_stock <= item.min_stock) ||
      (filterType === 'ACTIVE' && item.is_active) ||
      (filterType === 'INACTIVE' && !item.is_active);
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredTransactions = stockTransactions.filter(transaction => {
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Stok verileri yükleniyor...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stok Yönetimi</h1>
                <p className="mt-2 text-gray-600">Envanter ve stok hareketleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Stok Kartı
                </button>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-exchange-line mr-2"></i>
                  Stok Hareketi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('items')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'items'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-box-line mr-2"></i>
                  Stok Kartları
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transactions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-exchange-line mr-2"></i>
                  Stok Hareketleri
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-chart-line mr-2"></i>
                  Raporlar
                </button>
                <button
                  onClick={() => setActiveTab('count')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'count'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-scales-line mr-2"></i>
                  Stok Sayımı
                </button>
              </nav>
            </div>
          </div>

          {/* Stok Kartları Tab */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Stok Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-box-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Stok Kartı</p>
                      <p className="text-2xl font-bold text-gray-900">{stockItems.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-check-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Aktif Stok</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stockItems.filter(item => item.is_active).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <i className="ri-alert-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Düşük Stok</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stockItems.filter(item => item.current_stock <= item.min_stock).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Değer</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stockItems.reduce((sum, item) => sum + (item.current_stock * item.avg_cost), 0).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Stok kodu, adı veya kategori ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">Tüm Stoklar</option>
                      <option value="ACTIVE">Aktif Stoklar</option>
                      <option value="INACTIVE">Pasif Stoklar</option>
                      <option value="LOW_STOCK">Düşük Stok</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      Toplam: {filteredItems.length} stok
                    </span>
                  </div>
                </div>
              </div>

              {/* Stok Kartları Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Stok Kartları</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kod
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mevcut Stok
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Min/Max
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ort. Maliyet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Değer
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
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.code}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {item.current_stock} {item.unit}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.min_stock} / {item.max_stock}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.avg_cost.toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {(item.current_stock * item.avg_cost).toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                item.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                              {item.current_stock <= item.min_stock && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                  Düşük Stok
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Detay"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => {
                                  setNewTransaction(prev => ({ ...prev, stock_item_id: item.id }));
                                  setShowTransactionForm(true);
                                }}
                                className="text-purple-600 hover:text-purple-900"
                                title="Stok Hareketi"
                              >
                                <i className="ri-exchange-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stok Hareketleri Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Açıklama veya referans ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">Tüm Hareketler</option>
                      <option value="IN">Giriş</option>
                      <option value="OUT">Çıkış</option>
                      <option value="ADJUSTMENT">Düzeltme</option>
                      <option value="COUNT">Sayım</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      Toplam: {filteredTransactions.length} hareket
                    </span>
                  </div>
                </div>
              </div>

              {/* Stok Hareketleri Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Stok Hareketleri</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok Kartı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referans
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Miktar
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Birim Maliyet
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Maliyet
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === 'IN' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'OUT' ? 'bg-red-100 text-red-800' :
                              transaction.type === 'ADJUSTMENT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {transaction.type === 'IN' ? 'Giriş' :
                               transaction.type === 'OUT' ? 'Çıkış' :
                               transaction.type === 'ADJUSTMENT' ? 'Düzeltme' : 'Sayım'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.stock_item?.name || 'Bilinmiyor'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.stock_item?.code || ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.reference || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            <span className={`font-semibold ${
                              transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'IN' ? '+' : '-'}
                              {transaction.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {transaction.unit_cost.toLocaleString('tr-TR')} TL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            <span className="font-semibold">
                              {transaction.total_cost.toLocaleString('tr-TR')} TL
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Raporlar Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stok Raporları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Envanter Durumu</h3>
                  <p className="text-sm text-gray-600 mb-4">Mevcut stok durumu ve değerleri</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Stok Hareket Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Dönemsel stok giriş/çıkış analizi</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Düşük Stok Uyarısı</h3>
                  <p className="text-sm text-gray-600 mb-4">Minimum stok seviyesi altındaki ürünler</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Maliyet Analizi</h3>
                  <p className="text-sm text-gray-600 mb-4">Stok maliyet ve kar analizi</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stok Sayımı Tab */}
          {activeTab === 'count' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stok Sayımı</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className="ri-information-line text-yellow-600 text-xl mr-3"></i>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Stok Sayımı Bilgisi</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Fiziki stok sayımı yaparak sistem stokları ile karşılaştırın. 
                        Farklılıklar otomatik olarak düzeltme hareketi oluşturacaktır.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Yeni Sayım Başlat</h3>
                    <p className="text-sm text-gray-600 mb-4">Yeni bir stok sayımı başlatın</p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                      Sayım Başlat
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Devam Eden Sayımlar</h3>
                    <p className="text-sm text-gray-600 mb-4">Aktif sayım işlemlerini görüntüleyin</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Sayımları Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Yeni Stok Kartı Formu */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yeni Stok Kartı</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Kodu *
                    </label>
                    <input
                      type="text"
                      value={newItem.code}
                      onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="STK001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Adı *
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ürün adı"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Ürün açıklaması"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birim *
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ADET">Adet</option>
                      <option value="KG">Kilogram</option>
                      <option value="LT">Litre</option>
                      <option value="M">Metre</option>
                      <option value="M2">Metrekare</option>
                      <option value="M3">Metreküp</option>
                      <option value="PAKET">Paket</option>
                      <option value="KUTU">Kutu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kategori adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stok
                    </label>
                    <input
                      type="number"
                      value={newItem.min_stock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, min_stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimum Stok
                    </label>
                    <input
                      type="number"
                      value={newItem.max_stock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, max_stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.code.trim() || !newItem.name.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Yeni Stok Hareketi Formu */}
          {showTransactionForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yeni Stok Hareketi</h2>
                  <button
                    onClick={() => setShowTransactionForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hareket Türü *
                    </label>
                    <select
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="IN">Giriş</option>
                      <option value="OUT">Çıkış</option>
                      <option value="ADJUSTMENT">Düzeltme</option>
                      <option value="COUNT">Sayım</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Kartı *
                    </label>
                    <select
                      value={newTransaction.stock_item_id}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, stock_item_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Stok kartı seçin</option>
                      {stockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miktar *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.quantity}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birim Maliyet *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.unit_cost}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referans
                    </label>
                    <input
                      type="text"
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Fiş no, belge no vb."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Maliyet
                    </label>
                    <input
                      type="text"
                      value={(newTransaction.quantity * newTransaction.unit_cost).toLocaleString('tr-TR') + ' TL'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Hareket açıklaması"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowTransactionForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddTransaction}
                    disabled={!newTransaction.stock_item_id || !newTransaction.quantity || !newTransaction.unit_cost || !newTransaction.description.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
