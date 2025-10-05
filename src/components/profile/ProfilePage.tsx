'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'orders', label: 'Siparişlerim', icon: '📦' },
    { id: 'addresses', label: 'Adreslerim', icon: '📍' },
    { id: 'favorites', label: 'Favorilerim', icon: '❤️' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
          <p className="text-gray-600 mt-2">
            Hesap bilgilerinizi ve siparişlerinizi yönetin
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#CBA135] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Profil Bilgileri
                  </h2>
                  <p className="text-gray-600">
                    Profil bilgileriniz burada görüntülenecek.
                  </p>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Siparişlerim
                  </h2>
                  <p className="text-gray-600">
                    Siparişleriniz burada görüntülenecek.
                  </p>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Favorilerim
                  </h2>
                  <p className="text-gray-600">
                    Favori ürünleriniz burada görüntülenecek.
                  </p>
                </div>
              )}

              {/* Diğer tab'lar için placeholder */}
              {!['profile', 'orders', 'favorites'].includes(activeTab) && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-600">
                    Bu bölüm yakında eklenecek.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
