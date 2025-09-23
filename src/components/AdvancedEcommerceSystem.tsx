'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon, 
  ChartBarIcon, 
  TagIcon, 
  UserGroupIcon,
  CogIcon,
  TruckIcon,
  CreditCardIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function AdvancedEcommerceSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'products', name: 'Ürün Yönetimi', icon: TagIcon },
    { id: 'orders', name: 'Siparişler', icon: ShoppingCartIcon },
    { id: 'customers', name: 'Müşteriler', icon: UserGroupIcon },
    { id: 'shipping', name: 'Kargo', icon: TruckIcon },
    { id: 'reviews', name: 'Değerlendirmeler', icon: StarIcon },
    { id: 'promotions', name: 'Kampanyalar', icon: TagIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Satış</h4>
                <p className="text-3xl font-bold text-blue-600">₺2,450,000</p>
                <p className="text-sm text-blue-700">+15% bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Sipariş Sayısı</h4>
                <p className="text-3xl font-bold text-green-600">1,247</p>
                <p className="text-sm text-green-700">+8% bu ay</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Ortalama Sepet</h4>
                <p className="text-3xl font-bold text-yellow-600">₺1,965</p>
                <p className="text-sm text-yellow-700">+12% artış</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Dönüşüm Oranı</h4>
                <p className="text-3xl font-bold text-purple-600">%3.2</p>
                <p className="text-sm text-purple-700">+0.5% artış</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Laptop Bilgisayar</p>
                      <p className="text-sm text-blue-700">45 satış</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">₺89,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Akıllı Telefon</p>
                      <p className="text-sm text-green-700">38 satış</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">₺45,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Tablet</p>
                      <p className="text-sm text-yellow-700">32 satış</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">₺28,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Siparişler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#SP-2024-001</p>
                      <p className="text-sm text-gray-500">Ahmet Yılmaz</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₺2,450</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Tamamlandı
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#SP-2024-002</p>
                      <p className="text-sm text-gray-500">Elif Kaya</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₺1,890</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Kargoda
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#SP-2024-003</p>
                      <p className="text-sm text-gray-500">Mehmet Demir</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₺3,200</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Hazırlanıyor
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Ürün Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Ürün</h4>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-700">+23 bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Aktif Ürün</h4>
                <p className="text-3xl font-bold text-green-600">1,189</p>
                <p className="text-sm text-green-700">%95.3 oran</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Stokta Yok</h4>
                <p className="text-3xl font-bold text-yellow-600">58</p>
                <p className="text-sm text-yellow-700">%4.7 oran</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Ortalama Fiyat</h4>
                <p className="text-3xl font-bold text-purple-600">₺1,250</p>
                <p className="text-sm text-purple-700">+5% artış</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Ürün Listesi</h4>
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
                        Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <TagIcon className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Laptop Bilgisayar</div>
                            <div className="text-sm text-gray-500">SKU: LP-001</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Elektronik
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺15,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        45
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Düzenle</button>
                        <button className="text-red-600 hover:text-red-900">Sil</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Sipariş Yönetimi</h3>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>Tüm Siparişler</option>
                  <option>Bekleyen</option>
                  <option>Hazırlanıyor</option>
                  <option>Kargoda</option>
                  <option>Tamamlandı</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Filtrele
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Bekleyen</h4>
                <p className="text-3xl font-bold text-blue-600">23</p>
                <p className="text-sm text-blue-700">Onay bekliyor</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Hazırlanıyor</h4>
                <p className="text-3xl font-bold text-yellow-600">45</p>
                <p className="text-sm text-yellow-700">Paketleniyor</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Kargoda</h4>
                <p className="text-3xl font-bold text-purple-600">67</p>
                <p className="text-sm text-purple-700">Yolda</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Tamamlandı</h4>
                <p className="text-3xl font-bold text-green-600">1,112</p>
                <p className="text-sm text-green-700">Bu ay</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Son Siparişler</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #SP-2024-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Ahmet Yılmaz
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺2,450
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Tamamlandı
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Görüntüle</button>
                        <button className="text-green-600 hover:text-green-900">Yazdır</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Müşteri Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Müşteri Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Müşteri</h4>
                <p className="text-3xl font-bold text-blue-600">8,247</p>
                <p className="text-sm text-blue-700">+156 bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Aktif Müşteri</h4>
                <p className="text-3xl font-bold text-green-600">6,891</p>
                <p className="text-sm text-green-700">%83.5 oran</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Yeni Müşteri</h4>
                <p className="text-3xl font-bold text-yellow-600">156</p>
                <p className="text-sm text-yellow-700">Bu ay</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Ortalama Sipariş</h4>
                <p className="text-3xl font-bold text-purple-600">2.3</p>
                <p className="text-sm text-purple-700">Müşteri başına</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Müşteri Listesi</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş Sayısı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam Harcama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son Sipariş
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            AY
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Ahmet Yılmaz</div>
                            <div className="text-sm text-gray-500">+90 555 123 4567</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ahmet@email.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺12,450
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Görüntüle</button>
                        <button className="text-green-600 hover:text-green-900">Mesaj</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Bu modül geliştirilme aşamasındadır.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">E-ticaret Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Online mağaza yönetimi ve satış süreçleri</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
}
