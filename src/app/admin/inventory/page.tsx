'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface InventoryData {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  inventory: Array<{
    id: string;
    product_id: string;
    current_stock: number;
    minimum_stock: number;
    available_stock: number;
    location: string;
    cost_price: number;
    product: {
      name: string;
      sku: string;
      price: number;
    };
  }>;
  alerts: Array<{
    id: string;
    alert_type: string;
    current_stock: number;
    message: string;
    product: {
      name: string;
      sku: string;
    };
  }>;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category_id: string;
  is_active: boolean;
}

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_at: string;
  product: {
    name: string;
    sku: string;
  };
}

export default function AdminInventoryPage() {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'movements' | 'purchase'>('dashboard');
  const [showAddStock, setShowAddStock] = useState(false);
  const [showRemoveStock, setShowRemoveStock] = useState(false);
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [stockForm, setStockForm] = useState({
    product_id: '',
    quantity: '',
    reason: '',
    location: '',
    cost_per_unit: ''
  });

  const [purchaseOrderForm, setPurchaseOrderForm] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    notes: '',
    items: [] as Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      unit_cost: number;
    }>
  });

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      
      // Dashboard verilerini getir
      const dashboardResponse = await fetch('/api/inventory?type=dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.success) {
        setInventoryData(dashboardData.data);
      }

      // Diğer verileri getir
      const [productsResponse, suppliersResponse, movementsResponse] = await Promise.all([
        fetch('/api/inventory?type=products'),
        fetch('/api/inventory?type=suppliers'),
        fetch('/api/inventory?type=stock_movements')
      ]);

      const [productsData, suppliersData, movementsData] = await Promise.all([
        productsResponse.json(),
        suppliersResponse.json(),
        movementsResponse.json()
      ]);

      if (productsData.success) {
        setProducts(productsData.products);
      }

      if (suppliersData.success) {
        setSuppliers(suppliersData.suppliers);
      }

      if (movementsData.success) {
        setStockMovements(movementsData.movements);
      }

    } catch (error) {
      console.error('Fetch inventory data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_stock',
          ...stockForm,
          quantity: parseInt(stockForm.quantity),
          cost_per_unit: parseFloat(stockForm.cost_per_unit) || 0,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Stok başarıyla eklendi');
        setMessageType('success');
        setStockForm({
          product_id: '',
          quantity: '',
          reason: '',
          location: '',
          cost_per_unit: ''
        });
        setShowAddStock(false);
        fetchInventoryData();
      } else {
        setMessage(data.error || 'Stok eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add stock error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleRemoveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove_stock',
          ...stockForm,
          quantity: parseInt(stockForm.quantity),
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Stok başarıyla çıkarıldı');
        setMessageType('success');
        setStockForm({
          product_id: '',
          quantity: '',
          reason: '',
          location: '',
          cost_per_unit: ''
        });
        setShowRemoveStock(false);
        fetchInventoryData();
      } else {
        setMessage(data.error || 'Stok çıkarılamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Remove stock error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleCreatePurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_purchase_order',
          ...purchaseOrderForm,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Satın alma siparişi başarıyla oluşturuldu');
        setMessageType('success');
        setPurchaseOrderForm({
          supplier_id: '',
          order_date: new Date().toISOString().split('T')[0],
          expected_delivery_date: '',
          notes: '',
          items: []
        });
        setShowPurchaseOrder(false);
        fetchInventoryData();
      } else {
        setMessage(data.error || 'Satın alma siparişi oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create purchase order error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const addPurchaseOrderItem = () => {
    setPurchaseOrderForm({
      ...purchaseOrderForm,
      items: [...purchaseOrderForm.items, {
        product_id: '',
        product_name: '',
        quantity: 0,
        unit_cost: 0
      }]
    });
  };

  const removePurchaseOrderItem = (index: number) => {
    const newItems = purchaseOrderForm.items.filter((_, i) => i !== index);
    setPurchaseOrderForm({
      ...purchaseOrderForm,
      items: newItems
    });
  };

  const updatePurchaseOrderItem = (index: number, field: string, value: any) => {
    const newItems = [...purchaseOrderForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Eğer product_id değiştiyse, product_name'i güncelle
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].product_name = product.name;
      }
    }
    
    setPurchaseOrderForm({
      ...purchaseOrderForm,
      items: newItems
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getMovementTypeText = (type: string) => {
    const types: Record<string, string> = {
      'in': 'Giriş',
      'out': 'Çıkış',
      'adjustment': 'Düzeltme',
      'transfer': 'Transfer',
      'return': 'İade'
    };
    return types[type] || type;
  };

  const getMovementTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'in': 'bg-green-100 text-green-800',
      'out': 'bg-red-100 text-red-800',
      'adjustment': 'bg-blue-100 text-blue-800',
      'transfer': 'bg-yellow-100 text-yellow-800',
      'return': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <OptimizedLoader message="Stok verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h1>
            <p className="text-gray-600">Envanter takibi ve stok hareketleri</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddStock(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Stok Ekle
            </button>
            <button
              onClick={() => setShowRemoveStock(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Stok Çıkar
            </button>
            <button
              onClick={() => setShowPurchaseOrder(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Satın Alma Siparişi
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Envanter
              </button>
              <button
                onClick={() => setActiveTab('movements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'movements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stok Hareketleri
              </button>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchase'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Satın Alma
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && inventoryData && (
              <div className="space-y-6">
                {/* Stok Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-box-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {inventoryData.totalProducts}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <i className="ri-alert-line text-2xl text-yellow-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {inventoryData.lowStockCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <i className="ri-error-warning-line text-2xl text-red-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Stokta Yok</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {inventoryData.outOfStockCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(inventoryData.totalStockValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stok Uyarıları */}
                {inventoryData.alerts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stok Uyarıları</h3>
                    <div className="space-y-3">
                      {inventoryData.alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div>
                            <p className="font-medium text-red-900">{alert.product.name}</p>
                            <p className="text-sm text-red-700">{alert.message}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            {alert.current_stock} adet
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inventory' && inventoryData && (
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
                        Minimum Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanılabilir
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Konum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maliyet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryData.inventory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.current_stock <= 0 
                              ? 'bg-red-100 text-red-800'
                              : item.current_stock <= item.minimum_stock
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.current_stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.minimum_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.available_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.cost_price || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'movements' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ürün
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hareket Tipi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miktar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Önceki Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yeni Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sebep
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.map((movement) => (
                      <tr key={movement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(movement.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {movement.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.movement_type)}`}>
                            {getMovementTypeText(movement.movement_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {movement.previous_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.new_stock}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {movement.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'purchase' && (
              <div className="text-center py-12">
                <i className="ri-shopping-cart-line text-6xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Satın Alma Siparişleri</h3>
                <p className="text-gray-500">Satın alma siparişleri burada görüntülenecek</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Stock Modal */}
        {showAddStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok Ekle</h2>
              <form onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.product_id}
                    onChange={(e) => setStockForm({ ...stockForm, product_id: e.target.value })}
                  >
                    <option value="">Ürün seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sebep</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.reason}
                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.location}
                    onChange={(e) => setStockForm({ ...stockForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birim Maliyet</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.cost_per_unit}
                    onChange={(e) => setStockForm({ ...stockForm, cost_per_unit: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
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

        {/* Remove Stock Modal */}
        {showRemoveStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok Çıkar</h2>
              <form onSubmit={handleRemoveStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.product_id}
                    onChange={(e) => setStockForm({ ...stockForm, product_id: e.target.value })}
                  >
                    <option value="">Ürün seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sebep</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.reason}
                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stockForm.location}
                    onChange={(e) => setStockForm({ ...stockForm, location: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Stok Çıkar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRemoveStock(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Purchase Order Modal */}
        {showPurchaseOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Satın Alma Siparişi Oluştur</h2>
              <form onSubmit={handleCreatePurchaseOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={purchaseOrderForm.supplier_id}
                      onChange={(e) => setPurchaseOrderForm({ ...purchaseOrderForm, supplier_id: e.target.value })}
                    >
                      <option value="">Tedarikçi seçin</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={purchaseOrderForm.order_date}
                      onChange={(e) => setPurchaseOrderForm({ ...purchaseOrderForm, order_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beklenen Teslimat</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={purchaseOrderForm.expected_delivery_date}
                      onChange={(e) => setPurchaseOrderForm({ ...purchaseOrderForm, expected_delivery_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={purchaseOrderForm.notes}
                      onChange={(e) => setPurchaseOrderForm({ ...purchaseOrderForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Sipariş Kalemleri</h3>
                    <button
                      type="button"
                      onClick={addPurchaseOrderItem}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Kalem Ekle
                    </button>
                  </div>
                  
                  {purchaseOrderForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.product_id}
                          onChange={(e) => updatePurchaseOrderItem(index, 'product_id', e.target.value)}
                        >
                          <option value="">Ürün seçin</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                        <input
                          type="number"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.quantity}
                          onChange={(e) => updatePurchaseOrderItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birim Fiyat</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.unit_cost}
                          onChange={(e) => updatePurchaseOrderItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Toplam</label>
                        <input
                          type="number"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          value={item.quantity * item.unit_cost}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removePurchaseOrderItem(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Sipariş Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPurchaseOrder(false)}
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
    </AdminProtection>
  );
}
