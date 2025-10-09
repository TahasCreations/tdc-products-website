'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search, Filter, Download, Plus } from 'lucide-react';

export default function ProductInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - gerçek uygulamada API'den gelecek
  const inventoryItems = [
    {
      id: 'PRD-001',
      name: 'iPhone 15 Pro Max',
      sku: 'APL-IP15PM-256-BLK',
      category: 'Elektronik',
      stock: 45,
      minStock: 10,
      maxStock: 100,
      price: '₺52,999',
      status: 'Stokta',
      lastUpdate: '2024-01-15',
      supplier: 'Apple Turkey',
      location: 'Depo A - Raf 12'
    },
    {
      id: 'PRD-002',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SAM-S24U-512-TIT',
      category: 'Elektronik',
      stock: 8,
      minStock: 10,
      maxStock: 80,
      price: '₺48,999',
      status: 'Düşük Stok',
      lastUpdate: '2024-01-14',
      supplier: 'Samsung Electronics',
      location: 'Depo A - Raf 13'
    },
    {
      id: 'PRD-003',
      name: 'MacBook Pro 16"',
      sku: 'APL-MBP16-M3-1TB',
      category: 'Bilgisayar',
      stock: 0,
      minStock: 5,
      maxStock: 50,
      price: '₺89,999',
      status: 'Tükendi',
      lastUpdate: '2024-01-13',
      supplier: 'Apple Turkey',
      location: 'Depo B - Raf 5'
    },
    {
      id: 'PRD-004',
      name: 'Sony WH-1000XM5',
      sku: 'SNY-WH1000XM5-BLK',
      category: 'Ses Sistemleri',
      stock: 125,
      minStock: 20,
      maxStock: 100,
      price: '₺12,999',
      status: 'Fazla Stok',
      lastUpdate: '2024-01-15',
      supplier: 'Sony Turkey',
      location: 'Depo C - Raf 8'
    },
    {
      id: 'PRD-005',
      name: 'LG OLED C3 55"',
      sku: 'LG-C3-55-OLED',
      category: 'TV & Monitör',
      stock: 32,
      minStock: 15,
      maxStock: 60,
      price: '₺45,999',
      status: 'Stokta',
      lastUpdate: '2024-01-14',
      supplier: 'LG Electronics',
      location: 'Depo D - Raf 2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stokta': return 'bg-green-100 text-green-800';
      case 'Düşük Stok': return 'bg-yellow-100 text-yellow-800';
      case 'Tükendi': return 'bg-red-100 text-red-800';
      case 'Fazla Stok': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'Düşük Stok': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Tükendi': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Fazla Stok': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Package className="w-4 h-4 text-green-600" />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter(i => i.status === 'Stokta').length,
    lowStock: inventoryItems.filter(i => i.status === 'Düşük Stok').length,
    outOfStock: inventoryItems.filter(i => i.status === 'Tükendi').length,
    overStock: inventoryItems.filter(i => i.status === 'Fazla Stok').length,
    totalValue: '₺2,450,000'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Envanter Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Ürün stok durumlarını takip edin ve yönetin</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Dışa Aktar</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black px-4 py-2 rounded-lg hover:shadow-lg transition-all font-bold">
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Ürün</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Stokta</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Düşük Stok</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tükendi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.overStock}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Fazla Stok</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-black">{stats.totalValue}</div>
          <div className="text-sm text-black/70">Toplam Değer</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün adı veya SKU ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Stokta">Stokta</option>
            <option value="Düşük Stok">Düşük Stok</option>
            <option value="Tükendi">Tükendi</option>
            <option value="Fazla Stok">Fazla Stok</option>
          </select>
          <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Daha Fazla Filtre</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {getStockIcon(item.status)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.stock} adet</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Min: {item.minStock} / Max: {item.maxStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {getStockIcon(item.status)}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-[#CBA135] hover:text-[#F4D03F]">
                      Düzenle
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                      Stok Ekle
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">⚠️</span>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">Düşük Stok Uyarısı</h3>
          </div>
          <p className="text-red-700 dark:text-red-400 mb-4">{stats.lowStock} ürün minimum stok seviyesinin altında.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Sipariş Ver
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📦</span>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Toplu Stok Güncelleme</h3>
          </div>
          <p className="text-blue-700 dark:text-blue-400 mb-4">Birden fazla ürünün stok bilgilerini güncelleyin.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Başlat
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📊</span>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300">Envanter Raporu</h3>
          </div>
          <p className="text-purple-700 dark:text-purple-400 mb-4">Detaylı envanter analizi ve raporları oluşturun.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
