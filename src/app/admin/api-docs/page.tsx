'use client';

import { useState, useEffect } from 'react';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  KeyIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Array<{
    code: number;
    description: string;
    example: any;
  }>;
  category: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

export default function APIDocsPage() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API data
    const mockEndpoints: APIEndpoint[] = [
      {
        id: '1',
        method: 'GET',
        path: '/api/products',
        description: 'Tüm ürünleri listeler',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Sayfa numarası' },
          { name: 'limit', type: 'number', required: false, description: 'Sayfa başına ürün sayısı' },
          { name: 'category', type: 'string', required: false, description: 'Kategori filtresi' }
        ],
        responses: [
          { code: 200, description: 'Başarılı', example: { products: [], total: 0, page: 1 } },
          { code: 400, description: 'Geçersiz parametre', example: { error: 'Invalid parameters' } }
        ],
        category: 'Products'
      },
      {
        id: '2',
        method: 'POST',
        path: '/api/products',
        description: 'Yeni ürün oluşturur',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Ürün adı' },
          { name: 'price', type: 'number', required: true, description: 'Ürün fiyatı' },
          { name: 'category', type: 'string', required: true, description: 'Ürün kategorisi' }
        ],
        responses: [
          { code: 201, description: 'Ürün oluşturuldu', example: { id: '123', name: 'Test Product' } },
          { code: 400, description: 'Geçersiz veri', example: { error: 'Validation failed' } }
        ],
        category: 'Products'
      },
      {
        id: '3',
        method: 'GET',
        path: '/api/orders',
        description: 'Siparişleri listeler',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Sipariş durumu' },
          { name: 'customer_id', type: 'string', required: false, description: 'Müşteri ID' }
        ],
        responses: [
          { code: 200, description: 'Başarılı', example: { orders: [], total: 0 } },
          { code: 401, description: 'Yetkisiz erişim', example: { error: 'Unauthorized' } }
        ],
        category: 'Orders'
      }
    ];

    const mockApiKeys: APIKey[] = [
      {
        id: '1',
        name: 'Development Key',
        key: 'tdc_dev_1234567890abcdef',
        permissions: ['read:products', 'write:products', 'read:orders'],
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-20T10:30:00Z',
        isActive: true
      },
      {
        id: '2',
        name: 'Production Key',
        key: 'tdc_prod_abcdef1234567890',
        permissions: ['read:products', 'read:orders', 'read:analytics'],
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-19T15:45:00Z',
        isActive: true
      }
    ];

    setTimeout(() => {
      setEndpoints(mockEndpoints);
      setApiKeys(mockApiKeys);
      setLoading(false);
    }, 1000);
  }, []);

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800'
    };
    return colors[method as keyof typeof colors] || colors.GET;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification could be added here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
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
              <h1 className="text-3xl font-bold text-gray-900">API Dokümantasyonu</h1>
              <p className="text-gray-600 mt-1">Geliştiriciler için kapsamlı API rehberi</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <KeyIcon className="w-4 h-4 mr-2 inline" />
                API Anahtarı Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Endpoints */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                    </div>
                    <button
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {endpoint.category}
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        <PlayIcon className="w-4 h-4 mr-1 inline" />
                        Test Et
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                        <ClipboardDocumentIcon className="w-4 h-4 mr-1 inline" />
                        Kopyala
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Anahtarları</h2>
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{key.name}</h3>
                      <p className="text-sm text-gray-600">
                        {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 8)}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${key.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-xs text-gray-600">
                      <strong>Oluşturulma:</strong> {new Date(key.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Son Kullanım:</strong> {new Date(key.lastUsed).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">İzinler:</h4>
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="flex-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4 mr-1 inline" />
                      Kopyala
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoint Detail Modal */}
        {selectedEndpoint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </h3>
                <button
                  onClick={() => setSelectedEndpoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Açıklama</h4>
                  <p className="text-gray-600">{selectedEndpoint.description}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Parametreler</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parametre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gerekli</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {param.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {param.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {param.required ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Evet</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Hayır</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {param.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Yanıtlar</h4>
                  <div className="space-y-4">
                    {selectedEndpoint.responses.map((response, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            response.code >= 200 && response.code < 300 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {response.code}
                          </span>
                          <span className="text-sm text-gray-600">{response.description}</span>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(response.example, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
