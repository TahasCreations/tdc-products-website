'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  UserGroupIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  size: number;
  value: number;
  growth: number;
  avgOrderValue: number;
  frequency: number;
  lastPurchase: string;
  characteristics: string[];
  tags: string[];
  createdAt: string;
  isActive: boolean;
}

interface SegmentCriteria {
  ageRange?: { min: number; max: number };
  gender?: string[];
  location?: string[];
  purchaseAmount?: { min: number; max: number };
  purchaseFrequency?: { min: number; max: number };
  lastPurchaseDays?: { min: number; max: number };
  categories?: string[];
  paymentMethod?: string[];
  deviceType?: string[];
  customRules?: CustomRule[];
}

interface CustomRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  value2?: any;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  segment: string;
  totalSpent: number;
  orderCount: number;
  lastOrder: string;
  avgOrderValue: number;
  tags: string[];
  riskScore: number;
  lifetimeValue: number;
}

export default function CustomerSegmentation() {
  const { user } = useAuth();
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'segments' | 'customers' | 'analytics' | 'rules'>('segments');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Mock data
  useEffect(() => {
    const mockSegments: CustomerSegment[] = [
      {
        id: '1',
        name: 'VIP Müşteriler',
        description: 'En değerli müşterilerimiz',
        criteria: {
          purchaseAmount: { min: 10000, max: 999999 },
          purchaseFrequency: { min: 5, max: 999 },
          lastPurchaseDays: { min: 0, max: 30 }
        },
        size: 1250,
        value: 8500000,
        growth: 15.2,
        avgOrderValue: 6800,
        frequency: 8.5,
        lastPurchase: '2024-01-15',
        characteristics: ['Yüksek harcama', 'Sadık müşteri', 'Online alışveriş'],
        tags: ['VIP', 'Premium', 'High-Value'],
        createdAt: '2024-01-01',
        isActive: true
      },
      {
        id: '2',
        name: 'Genç Profesyoneller',
        description: '25-35 yaş arası teknoloji meraklısı müşteriler',
        criteria: {
          ageRange: { min: 25, max: 35 },
          categories: ['Electronics', 'Gadgets', 'Software'],
          deviceType: ['Mobile', 'Desktop']
        },
        size: 3200,
        value: 4200000,
        growth: 28.5,
        avgOrderValue: 1312,
        frequency: 3.2,
        lastPurchase: '2024-01-14',
        characteristics: ['Teknoloji meraklısı', 'Mobil kullanıcı', 'Hızlı karar verici'],
        tags: ['Young', 'Tech', 'Mobile'],
        createdAt: '2024-01-05',
        isActive: true
      },
      {
        id: '3',
        name: 'Aile Müşterileri',
        description: 'Aile odaklı güvenlik ve kalite arayan müşteriler',
        criteria: {
          ageRange: { min: 35, max: 55 },
          categories: ['Home', 'Kids', 'Safety'],
          paymentMethod: ['Credit Card', 'Bank Transfer']
        },
        size: 2100,
        value: 3800000,
        growth: 8.7,
        avgOrderValue: 1810,
        frequency: 2.8,
        lastPurchase: '2024-01-12',
        characteristics: ['Güvenlik odaklı', 'Aile değerleri', 'Güvenilir markalar'],
        tags: ['Family', 'Safety', 'Quality'],
        createdAt: '2024-01-10',
        isActive: true
      },
      {
        id: '4',
        name: 'Risk Müşterileri',
        description: 'Yüksek risk skoruna sahip müşteriler',
        criteria: {
          purchaseAmount: { min: 0, max: 1000 },
          lastPurchaseDays: { min: 90, max: 999 }
        },
        size: 850,
        value: 450000,
        growth: -5.2,
        avgOrderValue: 529,
        frequency: 1.2,
        lastPurchase: '2023-11-20',
        characteristics: ['Düşük harcama', 'Az sıklıkta alışveriş', 'Risk faktörü'],
        tags: ['Risk', 'Low-Value', 'Inactive'],
        createdAt: '2024-01-15',
        isActive: true
      }
    ];

    const mockCustomers: CustomerProfile[] = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        segment: 'VIP Müşteriler',
        totalSpent: 25000,
        orderCount: 12,
        lastOrder: '2024-01-15',
        avgOrderValue: 2083,
        tags: ['VIP', 'Premium'],
        riskScore: 15,
        lifetimeValue: 45000
      },
      {
        id: '2',
        name: 'Ayşe Kaya',
        email: 'ayse@example.com',
        segment: 'Genç Profesyoneller',
        totalSpent: 8500,
        orderCount: 8,
        lastOrder: '2024-01-14',
        avgOrderValue: 1062,
        tags: ['Young', 'Tech'],
        riskScore: 25,
        lifetimeValue: 12000
      },
      {
        id: '3',
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        segment: 'Aile Müşterileri',
        totalSpent: 12000,
        orderCount: 6,
        lastOrder: '2024-01-12',
        avgOrderValue: 2000,
        tags: ['Family', 'Safety'],
        riskScore: 20,
        lifetimeValue: 18000
      }
    ];

    setSegments(mockSegments);
    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 bg-green-100';
    if (growth < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         segment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || segment.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = !selectedSegment || customer.segment === selectedSegment.name;
    return matchesSearch && matchesSegment;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Müşteri Segmentasyonu</h1>
                <p className="mt-2 text-gray-600">Gelişmiş müşteri analizi ve segmentasyon</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Yeni Segment
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'segments', name: 'Segmentler', icon: UserGroupIcon },
                { id: 'customers', name: 'Müşteriler', icon: MagnifyingGlassIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon },
                { id: 'rules', name: 'Kurallar', icon: AdjustmentsHorizontalIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Segment veya müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Etiketler</option>
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Young">Genç</option>
              <option value="Tech">Teknoloji</option>
              <option value="Family">Aile</option>
              <option value="Risk">Risk</option>
            </select>
          </div>

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSegments.map((segment) => (
                  <div key={segment.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedSegment(segment)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Müşteri Sayısı:</span>
                          <span className="text-sm font-medium text-gray-900">{segment.size.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Toplam Değer:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(segment.value)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ortalama Sipariş:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(segment.avgOrderValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sipariş Sıklığı:</span>
                          <span className="text-sm font-medium text-gray-900">{segment.frequency.toFixed(1)}/ay</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Büyüme:</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getGrowthColor(segment.growth)}`}>
                            {segment.growth > 0 ? '+' : ''}{segment.growth.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {segment.tags.map((tag, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          Oluşturulma: {new Date(segment.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Müşteri Listesi</h3>
                </div>
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
                          Risk Skoru
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son Sipariş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Etiketler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {customer.segment}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(customer.totalSpent)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.orderCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(customer.riskScore)}`}>
                              {customer.riskScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(customer.lastOrder).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {customer.tags.map((tag, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                  {tag}
                                </span>
                              ))}
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserGroupIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Segment</p>
                      <p className="text-2xl font-semibold text-gray-900">{segments.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(segments.reduce((sum, s) => sum + s.value, 0))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ortalama AOV</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(segments.reduce((sum, s) => sum + s.avgOrderValue, 0) / segments.length)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ortalama Büyüme</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {((segments.reduce((sum, s) => sum + s.growth, 0) / segments.length)).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Performansı</h3>
                  <div className="space-y-4">
                    {segments.map((segment) => (
                      <div key={segment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{segment.name}</p>
                          <p className="text-xs text-gray-500">{segment.size.toLocaleString()} müşteri</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(segment.value)}</p>
                          <p className={`text-xs ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {segment.growth > 0 ? '+' : ''}{segment.growth.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analizi</h3>
                  <div className="space-y-4">
                    {customers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.segment}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(customer.riskScore)}`}>
                            Risk: {customer.riskScore}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{formatCurrency(customer.lifetimeValue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Kuralları</h3>
                <div className="space-y-4">
                  {segments.map((segment) => (
                    <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{segment.name}</h4>
                        <span className="text-sm text-gray-500">{segment.size.toLocaleString()} müşteri</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Kriterler:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {segment.criteria.purchaseAmount && (
                            <li>
                              Sipariş tutarı: {formatCurrency(segment.criteria.purchaseAmount.min)} - {formatCurrency(segment.criteria.purchaseAmount.max)}
                            </li>
                          )}
                          {segment.criteria.ageRange && (
                            <li>
                              Yaş aralığı: {segment.criteria.ageRange.min} - {segment.criteria.ageRange.max}
                            </li>
                          )}
                          {segment.criteria.categories && (
                            <li>
                              Kategoriler: {segment.criteria.categories.join(', ')}
                            </li>
                          )}
                          {segment.criteria.lastPurchaseDays && (
                            <li>
                              Son sipariş: {segment.criteria.lastPurchaseDays.min} - {segment.criteria.lastPurchaseDays.max} gün önce
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}

