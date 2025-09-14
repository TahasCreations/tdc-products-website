'use client';

import { useState, useEffect } from 'react';
import {
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function AdvancedAISystem() {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'chatbot', name: 'AI Chatbot', icon: ChatBubbleLeftRightIcon },
    { id: 'recommendations', name: 'Öneri Sistemi', icon: LightBulbIcon },
    { id: 'analytics', name: 'AI Analitik', icon: ChartBarIcon },
    { id: 'settings', name: 'AI Ayarları', icon: CogIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chatbot':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Chatbot Yönetimi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Aktif Konuşmalar</h4>
                  <p className="text-3xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-blue-700">+12% bu hafta</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Çözüm Oranı</h4>
                  <p className="text-3xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-green-700">+5% bu ay</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Öneri Sistemi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Günlük Öneriler</h4>
                  <p className="text-3xl font-bold text-purple-600">1,247</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Tıklama Oranı</h4>
                  <p className="text-3xl font-bold text-orange-600">23%</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-900 mb-2">Dönüşüm Oranı</h4>
                  <p className="text-3xl font-bold text-pink-600">8.5%</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analitik</h3>
              <div className="text-center py-12">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">AI analitik verileri yükleniyor...</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">AI Chatbot Aktif</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Öneri Sistemi</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Otomatik Öğrenme</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Sistem Yönetimi</h2>
          <p className="text-sm text-gray-500 mt-1">Yapay zeka sistemlerini yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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