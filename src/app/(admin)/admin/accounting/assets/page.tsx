'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function FixedAssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const assets = [
    {
      id: '1',
      code: 'AST-001',
      name: 'Dell OptiPlex 7090 Desktop',
      category: 'COMPUTER',
      purchaseDate: '2023-01-15',
      purchasePrice: 15000,
      currentValue: 12000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 5,
      accumulatedDepreciation: 3000,
      netBookValue: 12000,
      location: 'IT Departmanı',
      status: 'ACTIVE',
      supplier: 'ABC Bilgisayar A.Ş.'
    },
    {
      id: '2',
      code: 'AST-002',
      name: 'Canon EOS R5 Kamera',
      category: 'CAMERA',
      purchaseDate: '2023-03-20',
      purchasePrice: 45000,
      currentValue: 38000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 7,
      accumulatedDepreciation: 7000,
      netBookValue: 38000,
      location: 'Pazarlama Departmanı',
      status: 'ACTIVE',
      supplier: 'XYZ Fotoğraf Ltd.'
    },
    {
      id: '3',
      code: 'AST-003',
      name: 'Herman Miller Aeron Sandalye',
      category: 'FURNITURE',
      purchaseDate: '2023-06-10',
      purchasePrice: 8000,
      currentValue: 7000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 10,
      accumulatedDepreciation: 1000,
      netBookValue: 7000,
      location: 'Yönetim Ofisi',
      status: 'ACTIVE',
      supplier: 'DEF Mobilya A.Ş.'
    },
    {
      id: '4',
      code: 'AST-004',
      name: 'MacBook Pro 16" M2',
      category: 'COMPUTER',
      purchaseDate: '2023-09-05',
      purchasePrice: 35000,
      currentValue: 30000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 4,
      accumulatedDepreciation: 5000,
      netBookValue: 30000,
      location: 'Tasarım Departmanı',
      status: 'ACTIVE',
      supplier: 'Apple Store'
    },
    {
      id: '5',
      code: 'AST-005',
      name: '3D Printer Ultimaker S3',
      category: 'EQUIPMENT',
      purchaseDate: '2022-12-01',
      purchasePrice: 25000,
      currentValue: 15000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 8,
      accumulatedDepreciation: 10000,
      netBookValue: 15000,
      location: 'Üretim Atölyesi',
      status: 'MAINTENANCE',
      supplier: 'GHI Teknoloji Ltd.'
    },
    {
      id: '6',
      code: 'AST-006',
      name: 'Samsung 55" 4K TV',
      category: 'ELECTRONICS',
      purchaseDate: '2023-11-15',
      purchasePrice: 12000,
      currentValue: 11000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 6,
      accumulatedDepreciation: 1000,
      netBookValue: 11000,
      location: 'Toplantı Salonu',
      status: 'ACTIVE',
      supplier: 'JKL Elektronik A.Ş.'
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPUTER': return 'text-blue-600 bg-blue-50';
      case 'CAMERA': return 'text-purple-600 bg-purple-50';
      case 'FURNITURE': return 'text-green-600 bg-green-50';
      case 'EQUIPMENT': return 'text-orange-600 bg-orange-50';
      case 'ELECTRONICS': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'COMPUTER': return 'Bilgisayar';
      case 'CAMERA': return 'Kamera';
      case 'FURNITURE': return 'Mobilya';
      case 'EQUIPMENT': return 'Ekipman';
      case 'ELECTRONICS': return 'Elektronik';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'DISPOSED': return 'bg-red-100 text-red-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'MAINTENANCE': return 'Bakımda';
      case 'DISPOSED': return 'Elden Çıkarıldı';
      case 'INACTIVE': return 'Pasif';
      default: return 'Bilinmiyor';
    }
  };

  const getDepreciationMethodText = (method: string) => {
    switch (method) {
      case 'STRAIGHT_LINE': return 'Düz Çizgi';
      case 'DECLINING_BALANCE': return 'Azalan Bakiye';
      case 'SUM_OF_YEARS': return 'Yıllar Toplamı';
      default: return 'Bilinmiyor';
    }
  };

  const totalPurchaseValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Duran Varlıklar</h1>
            <p className="text-gray-600 mt-1">Sabit kıymetler ve amortisman takibi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + Yeni Varlık
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              📊 Rapor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Varlık</p>
                <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alış Değeri</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalPurchaseValue.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Güncel Değer</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalCurrentValue.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Amortisman</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalDepreciation.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Varlık ara (isim, kod, konum)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="COMPUTER">Bilgisayar</option>
              <option value="CAMERA">Kamera</option>
              <option value="FURNITURE">Mobilya</option>
              <option value="EQUIPMENT">Ekipman</option>
              <option value="ELECTRONICS">Elektronik</option>
            </select>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Duran Varlık Listesi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Varlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alış Değeri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Güncel Değer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amortisman
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
                {filteredAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.code}</div>
                        <div className="text-xs text-gray-400">{asset.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(asset.category)}`}>
                        {getCategoryText(asset.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{asset.purchasePrice.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{asset.currentValue.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₺{asset.accumulatedDepreciation.toLocaleString('tr-TR')}</div>
                      <div className="text-xs text-gray-500">{getDepreciationMethodText(asset.depreciationMethod)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                        {getStatusText(asset.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          👁️
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          📊
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Details */}
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Varlık Detayları - {selectedAsset.name}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Varlık Kodu</label>
                <p className="text-gray-900 font-mono">{selectedAsset.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedAsset.category)}`}>
                  {getCategoryText(selectedAsset.category)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alış Tarihi</label>
                <p className="text-gray-900">{new Date(selectedAsset.purchaseDate).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
                <p className="text-gray-900">{selectedAsset.supplier}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                <p className="text-gray-900">{selectedAsset.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAsset.status)}`}>
                  {getStatusText(selectedAsset.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Alış Değeri</h4>
                <p className="text-2xl font-bold text-blue-900">₺{selectedAsset.purchasePrice.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">Güncel Değer</h4>
                <p className="text-2xl font-bold text-green-900">₺{selectedAsset.currentValue.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800 mb-1">Toplam Amortisman</h4>
                <p className="text-2xl font-bold text-orange-900">₺{selectedAsset.accumulatedDepreciation.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Defter Değeri</h4>
                <p className="text-2xl font-bold text-purple-900">₺{selectedAsset.netBookValue.toLocaleString('tr-TR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amortisman Yöntemi</label>
                <p className="text-gray-900">{getDepreciationMethodText(selectedAsset.depreciationMethod)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faydalı Ömür</label>
                <p className="text-gray-900">{selectedAsset.usefulLife} yıl</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Amortisman Hesapla
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Bakım Kaydı
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Elden Çıkar
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
