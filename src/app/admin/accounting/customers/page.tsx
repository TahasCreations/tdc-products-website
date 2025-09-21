'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  code: string;
  name: string;
  type: 'individual' | 'corporate';
  taxNumber: string;
  taxOffice: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  contactPerson: string;
  creditLimit: number;
  currentBalance: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  lastTransaction: string;
  totalSales: number;
  paymentTerms: number; // days
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  totalReceivables: number;
  overdueAmount: number;
  averagePaymentTime: number;
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Mock customer data
    const mockCustomers: Customer[] = [
      {
        id: '1',
        code: 'CAR001',
        name: 'ABC Teknoloji A.Ş.',
        type: 'corporate',
        taxNumber: '1234567890',
        taxOffice: 'Kadıköy Vergi Dairesi',
        address: 'Atatürk Mah. Teknoloji Cad. No:123',
        city: 'İstanbul',
        phone: '+90 216 123 45 67',
        email: 'info@abcteknoloji.com',
        contactPerson: 'Ahmet Yılmaz',
        creditLimit: 100000,
        currentBalance: 25000,
        riskLevel: 'low',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastTransaction: '2024-01-20T10:30:00Z',
        totalSales: 150000,
        paymentTerms: 30
      },
      {
        id: '2',
        code: 'CAR002',
        name: 'Mehmet Demir',
        type: 'individual',
        taxNumber: '9876543210',
        taxOffice: 'Beşiktaş Vergi Dairesi',
        address: 'Ortaköy Mah. Deniz Cad. No:45',
        city: 'İstanbul',
        phone: '+90 532 987 65 43',
        email: 'mehmet@email.com',
        contactPerson: 'Mehmet Demir',
        creditLimit: 50000,
        currentBalance: 15000,
        riskLevel: 'medium',
        status: 'active',
        createdAt: '2024-01-05T00:00:00Z',
        lastTransaction: '2024-01-18T14:20:00Z',
        totalSales: 75000,
        paymentTerms: 15
      },
      {
        id: '3',
        code: 'CAR003',
        name: 'XYZ İnşaat Ltd. Şti.',
        type: 'corporate',
        taxNumber: '1122334455',
        taxOffice: 'Şişli Vergi Dairesi',
        address: 'Mecidiyeköy Mah. İnşaat Cad. No:78',
        city: 'İstanbul',
        phone: '+90 212 555 12 34',
        email: 'muhasebe@xyzinşaat.com',
        contactPerson: 'Fatma Kaya',
        creditLimit: 200000,
        currentBalance: 75000,
        riskLevel: 'high',
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        lastTransaction: '2024-01-15T09:45:00Z',
        totalSales: 300000,
        paymentTerms: 45
      }
    ];

    const mockStats: CustomerStats = {
      totalCustomers: 3,
      activeCustomers: 3,
      newThisMonth: 1,
      totalReceivables: 115000,
      overdueAmount: 25000,
      averagePaymentTime: 28
    };

    setTimeout(() => {
      setCustomers(mockCustomers);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  const getRiskText = (risk: string) => {
    const texts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek'
    };
    return texts[risk as keyof typeof texts] || risk;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Aktif',
      inactive: 'Pasif',
      blocked: 'Bloklu'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.taxNumber.includes(searchTerm);
    const matchesType = filterType === 'all' || customer.type === filterType;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cari Hesap Yönetimi</h1>
              <p className="text-gray-600 mt-1">Müşteri ve tedarikçi hesaplarını yönetin</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <DocumentTextIcon className="w-4 h-4 mr-2 inline" />
                Rapor İndir
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Cari</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers}</p>
                <p className="text-sm text-gray-500">Hesap</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Cari</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeCustomers}</p>
                <p className="text-sm text-gray-500">Hesap</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Alacak</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalReceivables || 0)}</p>
                <p className="text-sm text-gray-500">TL</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.overdueAmount || 0)}</p>
                <p className="text-sm text-gray-500">TL</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Tipler</option>
              <option value="individual">Bireysel</option>
              <option value="corporate">Kurumsal</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="blocked">Bloklu</option>
            </select>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Cari Hesaplar ({filteredCustomers.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cari Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finansal Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk & Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
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
                            <UserGroupIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.code}</div>
                          <div className="text-xs text-gray-400">
                            {customer.type === 'individual' ? 'Bireysel' : 'Kurumsal'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center mt-1">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {customer.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex justify-between">
                          <span>Kredi Limiti:</span>
                          <span className="font-medium">{formatCurrency(customer.creditLimit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bakiye:</span>
                          <span className={`font-medium ${customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(customer.currentBalance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toplam Satış:</span>
                          <span className="font-medium">{formatCurrency(customer.totalSales)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(customer.riskLevel)}`}>
                          {getRiskText(customer.riskLevel)} Risk
                        </span>
                        <br />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4" />
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
    </div>
  );
}
