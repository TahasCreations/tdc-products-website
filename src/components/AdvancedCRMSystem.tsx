'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: 'VIP' | 'Premium' | 'Standard' | 'Basic';
  status: 'active' | 'inactive' | 'prospect' | 'churned';
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  registrationDate: string;
  source: string;
  tags: string[];
  notes: string;
  assignedTo: string;
  leadScore: number;
  lifetimeValue: number;
  churnRisk: 'low' | 'medium' | 'high';
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    communication: 'email' | 'sms' | 'phone' | 'none';
  };
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  customerCount: number;
  averageValue: number;
  growthRate: number;
  color: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'social';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  targetSegment: string;
  subject: string;
  content: string;
  scheduledDate: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

interface Interaction {
  id: string;
  customerId: string;
  type: 'email' | 'call' | 'meeting' | 'support' | 'purchase' | 'website';
  subject: string;
  description: string;
  timestamp: string;
  user: string;
  outcome: 'positive' | 'neutral' | 'negative';
  nextAction: string;
  scheduledDate?: string;
}

export default function AdvancedCRMSystem() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'customers' | 'segments' | 'campaigns' | 'analytics'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { addToast } = useToast();

  const fetchCRMData = useCallback(async () => {
    setLoading(true);
    try {
      const [customersResponse, segmentsResponse, campaignsResponse, interactionsResponse] = await Promise.all([
        fetch('/api/crm/customers'),
        fetch('/api/crm/segments'),
        fetch('/api/crm/campaigns'),
        fetch('/api/crm/interactions')
      ]);

      const [customersData, segmentsData, campaignsData, interactionsData] = await Promise.all([
        customersResponse.json(),
        segmentsResponse.json(),
        campaignsResponse.json(),
        interactionsResponse.json()
      ]);

      setCustomers(customersData);
      setSegments(segmentsData);
      setCampaigns(campaignsData);
      setInteractions(interactionsData);
    } catch (error) {
      console.error('CRM fetch error:', error);
      addToast({
        type: 'error',
        title: 'CRM Verisi Hatası',
        message: 'CRM verileri yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCRMData();
  }, [fetchCRMData]);

  const runCustomerSegmentation = async () => {
    try {
      const response = await fetch('/api/ai/crm/segment-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers })
      });

      const newSegments = await response.json();
      setSegments(newSegments);
      
      addToast({
        type: 'success',
        title: 'Segmentasyon Tamamlandı',
        message: `${newSegments.length} müşteri segmenti oluşturuldu`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Segmentasyon Hatası',
        message: 'Müşteri segmentasyonu tamamlanamadı'
      });
    }
  };

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const response = await fetch('/api/crm/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        const newCampaign = await response.json();
        setCampaigns(prev => [newCampaign, ...prev]);
        
        addToast({
          type: 'success',
          title: 'Kampanya Oluşturuldu',
          message: 'Yeni kampanya başarıyla oluşturuldu'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Kampanya Hatası',
        message: 'Kampanya oluşturulamadı'
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    return selectedSegment === 'all' || customer.segment === selectedSegment;
  });

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'text-purple-600 bg-purple-100';
      case 'Premium': return 'text-blue-600 bg-blue-100';
      case 'Standard': return 'text-green-600 bg-green-100';
      case 'Basic': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'prospect': return 'text-blue-600 bg-blue-100';
      case 'churned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">CRM verileri yükleniyor...</p>
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
            <i className="ri-user-heart-line text-3xl text-blue-600 mr-3"></i>
            Gelişmiş CRM Sistemi
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={runCustomerSegmentation}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-brain-line mr-2"></i>
              AI Segmentasyon
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'customers', label: 'Müşteriler', icon: 'ri-user-line' },
            { key: 'segments', label: 'Segmentler', icon: 'ri-group-line' },
            { key: 'campaigns', label: 'Kampanyalar', icon: 'ri-mail-line' },
            { key: 'analytics', label: 'Analitik', icon: 'ri-bar-chart-line' }
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
        {viewMode === 'customers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segment Seçimi
              </label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Segmentler</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.name}>
                    {segment.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="prospect">Potansiyel</option>
                <option value="churned">Kaybedilen</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customers View */}
      {viewMode === 'customers' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  Toplam
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {customers.length.toLocaleString('tr-TR')}
              </div>
              <div className="text-sm text-gray-600">Müşteri</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Ortalama
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₺{Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString('tr-TR')}
              </div>
              <div className="text-sm text-gray-600">Müşteri Değeri</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-vip-crown-line text-2xl text-purple-600"></i>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  VIP
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {customers.filter(c => c.segment === 'VIP').length}
              </div>
              <div className="text-sm text-gray-600">VIP Müşteri</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <i className="ri-alert-line text-2xl text-red-600"></i>
                </div>
                <div className="text-sm font-medium text-red-600">
                  Risk
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {customers.filter(c => c.churnRisk === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Yüksek Risk</div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Müşteri Listesi</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam Harcama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Churn Riski
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksiyonlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(customer.segment)}`}>
                          {customer.segment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{customer.totalSpent.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChurnRiskColor(customer.churnRisk)}`}>
                          {customer.churnRisk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Detay
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Mesaj
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Segments View */}
      {viewMode === 'segments' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Müşteri Segmentleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <div key={segment.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{segment.name}</h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Müşteri Sayısı:</span>
                    <span className="font-semibold">{segment.customerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ortalama Değer:</span>
                    <span className="font-semibold">₺{segment.averageValue.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Büyüme Oranı:</span>
                    <span className={`font-semibold ${segment.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      %{segment.growthRate.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Kampanya Oluştur
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns View */}
      {viewMode === 'campaigns' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Kampanyalar</h3>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Yeni Kampanya
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'running' ? 'bg-green-100 text-green-600' :
                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{campaign.subject}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gönderilen:</span>
                    <span className="font-medium">{campaign.sentCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Açılma Oranı:</span>
                    <span className="font-medium">%{campaign.openRate.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tıklama Oranı:</span>
                    <span className="font-medium">%{campaign.clickRate.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dönüşüm:</span>
                    <span className="font-medium">%{campaign.conversionRate.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gelir:</span>
                    <span className="font-semibold text-green-600">₺{campaign.revenue.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">CRM Analitikleri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Müşteri Yaşam Döngüsü</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Yeni Müşteriler:</span>
                    <span className="font-medium">{customers.filter(c => c.status === 'prospect').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Aktif Müşteriler:</span>
                    <span className="font-medium">{customers.filter(c => c.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Kaybedilen Müşteriler:</span>
                    <span className="font-medium">{customers.filter(c => c.status === 'churned').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Segment Performansı</h4>
                <div className="space-y-2">
                  {segments.map((segment) => (
                    <div key={segment.id} className="flex justify-between">
                      <span className="text-sm text-green-700">{segment.name}:</span>
                      <span className="font-medium">₺{segment.averageValue.toLocaleString('tr-TR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
