'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UserPlusIcon, 
  ClockIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function AdvancedHRSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'employees', name: 'Çalışanlar', icon: UserGroupIcon },
    { id: 'recruitment', name: 'İşe Alım', icon: UserPlusIcon },
    { id: 'attendance', name: 'Devam Takibi', icon: ClockIcon },
    { id: 'payroll', name: 'Bordro', icon: CurrencyDollarIcon },
    { id: 'documents', name: 'Belgeler', icon: DocumentTextIcon },
    { id: 'calendar', name: 'Takvim', icon: CalendarIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Çalışan</h4>
                <p className="text-3xl font-bold text-blue-600">156</p>
                <p className="text-sm text-blue-700">+8% bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Aktif Pozisyon</h4>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-green-700">3 yeni açılış</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Bekleyen İzin</h4>
                <p className="text-3xl font-bold text-yellow-600">23</p>
                <p className="text-sm text-yellow-700">Bu hafta</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Ortalama Maaş</h4>
                <p className="text-3xl font-bold text-purple-600">₺15,500</p>
                <p className="text-sm text-purple-700">+5% artış</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşe Alımlar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        AY
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ahmet Yılmaz</p>
                        <p className="text-sm text-gray-500">Yazılım Geliştirici</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Yeni</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        EK
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Elif Kaya</p>
                        <p className="text-sm text-gray-500">Pazarlama Uzmanı</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Yeni</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Etkinlikler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Toplantı: Proje Değerlendirme</p>
                      <p className="text-sm text-blue-700">Bugün 14:00</p>
                    </div>
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Eğitim: Yeni Sistem</p>
                      <p className="text-sm text-green-700">Yarın 10:00</p>
                    </div>
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Çalışan Listesi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Çalışan Ekle
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Çalışan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pozisyon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departman
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
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            AY
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Ahmet Yılmaz</div>
                            <div className="text-sm text-gray-500">ahmet@company.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Yazılım Geliştirici
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        IT
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

      case 'recruitment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">İşe Alım Süreçleri</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Pozisyon Aç
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Açık Pozisyonlar</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Frontend Developer</p>
                    <p className="text-sm text-blue-700">5 başvuru</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">UX Designer</p>
                    <p className="text-sm text-green-700">12 başvuru</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Mülakatlar</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Bugün 14:00</p>
                    <p className="text-sm text-yellow-700">Mehmet Demir - Frontend</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">Yarın 10:00</p>
                    <p className="text-sm text-purple-700">Ayşe Kaya - UX</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">İstatistikler</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Toplam Başvuru</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mülakat Oranı</span>
                    <span className="font-semibold">%23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İşe Alım Oranı</span>
                    <span className="font-semibold">%8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Devam Takibi</h3>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>Bu Ay</option>
                  <option>Geçen Ay</option>
                  <option>Bu Yıl</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Rapor Al
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Ortalama Devam</h4>
                <p className="text-3xl font-bold text-green-600">%94</p>
                <p className="text-sm text-green-700">+2% bu ay</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Çalışma Saati</h4>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-700">Bu ay</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Geç Kalma</h4>
                <p className="text-3xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-yellow-700">Bu ay</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">İzin Kullanımı</h4>
                <p className="text-3xl font-bold text-red-600">23</p>
                <p className="text-sm text-red-700">Bu ay</p>
              </div>
            </div>
          </div>
        );

      case 'payroll':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Bordro Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Bordro Oluştur
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Bu Ay Bordro Özeti</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toplam Maaş</span>
                    <span className="font-semibold">₺2,340,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vergi Kesintisi</span>
                    <span className="font-semibold">₺468,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SGK Kesintisi</span>
                    <span className="font-semibold">₺234,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-900 font-semibold">Net Ödeme</span>
                    <span className="font-bold text-green-600">₺1,638,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Son Bordrolar</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Aralık 2024</p>
                      <p className="text-sm text-gray-500">156 çalışan</p>
                    </div>
                    <span className="text-green-600 font-semibold">Ödendi</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Kasım 2024</p>
                      <p className="text-sm text-gray-500">154 çalışan</p>
                    </div>
                    <span className="text-green-600 font-semibold">Ödendi</span>
                  </div>
                </div>
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
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Geri</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İnsan Kaynakları Sistemi</h2>
            <p className="text-sm text-gray-500 mt-1">Çalışan yönetimi ve HR süreçleri</p>
          </div>
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
