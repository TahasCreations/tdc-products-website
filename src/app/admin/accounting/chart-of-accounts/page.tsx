'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  TableCellsIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  level: number;
  isActive: boolean;
  description?: string;
  normalBalance: 'debit' | 'credit';
  currentBalance: number;
  openingBalance: number;
  createdAt: string;
  children?: Account[];
}

export default function ChartOfAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockAccounts: Account[] = [
      {
        id: '1',
        code: '1',
        name: 'VARLIKLAR',
        type: 'asset',
        level: 0,
        isActive: true,
        normalBalance: 'debit',
        currentBalance: 800000,
        openingBalance: 750000,
        createdAt: '2024-01-01',
        children: [
          {
            id: '11',
            code: '11',
            name: 'DÖNEN VARLIKLAR',
            type: 'asset',
            parentId: '1',
            level: 1,
            isActive: true,
            normalBalance: 'debit',
            currentBalance: 300000,
            openingBalance: 280000,
            createdAt: '2024-01-01',
            children: [
              {
                id: '100',
                code: '100',
                name: 'KASA',
                type: 'asset',
                parentId: '11',
                level: 2,
                isActive: true,
                normalBalance: 'debit',
                currentBalance: 10000,
                openingBalance: 8000,
                createdAt: '2024-01-01'
              },
              {
                id: '102',
                code: '102',
                name: 'BANKA HESAPLARI',
                type: 'asset',
                parentId: '11',
                level: 2,
                isActive: true,
                normalBalance: 'debit',
                currentBalance: 40000,
                openingBalance: 37000,
                createdAt: '2024-01-01'
              }
            ]
          }
        ]
      },
      {
        id: '2',
        code: '2',
        name: 'BORÇLAR',
        type: 'liability',
        level: 0,
        isActive: true,
        normalBalance: 'credit',
        currentBalance: 300000,
        openingBalance: 280000,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        code: '3',
        name: 'ÖZKAYNAKLAR',
        type: 'equity',
        level: 0,
        isActive: true,
        normalBalance: 'credit',
        currentBalance: 500000,
        openingBalance: 470000,
        createdAt: '2024-01-01'
      }
    ];

    setAccounts(mockAccounts);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'text-green-600 bg-green-100';
      case 'liability': return 'text-red-600 bg-red-100';
      case 'equity': return 'text-blue-600 bg-blue-100';
      case 'revenue': return 'text-purple-600 bg-purple-100';
      case 'expense': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'asset': return 'Varlık';
      case 'liability': return 'Borç';
      case 'equity': return 'Özkaynak';
      case 'revenue': return 'Gelir';
      case 'expense': return 'Gider';
      default: return 'Bilinmiyor';
    }
  };

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const renderAccount = (account: Account, level: number = 0) => {
    const isExpanded = expandedAccounts.has(account.id);
    const hasChildren = account.children && account.children.length > 0;
    const indentClass = `ml-${level * 4}`;

    return (
      <div key={account.id} className="border-b border-gray-200">
        <div className={`flex items-center py-3 px-4 hover:bg-gray-50 ${indentClass}`}>
          <div className="flex items-center flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(account.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm text-gray-600 w-20">{account.code}</span>
                <span className="font-medium text-gray-900">{account.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                  {getAccountTypeName(account.type)}
                </span>
                {!account.isActive && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    Pasif
                  </span>
                )}
              </div>
              {account.description && (
                <p className="text-sm text-gray-500 mt-1">{account.description}</p>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(account.currentBalance)}
              </div>
              <div className="text-xs text-gray-500">
                {account.normalBalance === 'debit' ? 'Borç' : 'Alacak'}
              </div>
            </div>
            
            <div className="ml-4 flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded">
                <PencilIcon className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {account.children?.map(child => renderAccount(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
                <h1 className="text-3xl font-bold text-gray-900">Hesap Planı</h1>
                <p className="mt-2 text-gray-600">Muhasebe hesap planı yönetimi</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                  İçe Aktar
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Yeni Hesap
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Hesap kodu veya adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Türü</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Tümü</option>
                  <option value="asset">Varlık</option>
                  <option value="liability">Borç</option>
                  <option value="equity">Özkaynak</option>
                  <option value="revenue">Gelir</option>
                  <option value="expense">Gider</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filtrele
                </button>
              </div>
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Hesap Listesi</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedAccounts(new Set(accounts.map(a => a.id)))}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Tümünü Aç
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setExpandedAccounts(new Set())}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Tümünü Kapat
                  </button>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {accounts.map(account => renderAccount(account))}
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}