'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function APIDocumentation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState('products');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Generate mock API key
      setApiKey('tdc_live_sk_1234567890abcdef');
    } else {
      router.push('/admin');
    }
  }, [router]);

  const endpoints = [
    {
      id: 'products',
      name: 'Products API',
      description: 'Ürün yönetimi için API endpoints',
      baseUrl: '/api/products',
      methods: [
        {
          method: 'GET',
          path: '/api/products',
          description: 'Tüm ürünleri listele',
          parameters: [
            { name: 'page', type: 'number', required: false, description: 'Sayfa numarası' },
            { name: 'limit', type: 'number', required: false, description: 'Sayfa başına ürün sayısı' },
            { name: 'category', type: 'string', required: false, description: 'Kategori filtresi' },
            { name: 'search', type: 'string', required: false, description: 'Arama terimi' }
          ],
          response: {
            status: 200,
            data: {
              products: [
                {
                  id: 'string',
                  name: 'string',
                  description: 'string',
                  price: 'number',
                  category: 'string',
                  stock: 'number',
                  images: 'string[]',
                  variants: 'object[]'
                }
              ],
              pagination: {
                page: 'number',
                limit: 'number',
                total: 'number',
                pages: 'number'
              }
            }
          }
        },
        {
          method: 'POST',
          path: '/api/products',
          description: 'Yeni ürün oluştur',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Ürün adı' },
            { name: 'description', type: 'string', required: true, description: 'Ürün açıklaması' },
            { name: 'price', type: 'number', required: true, description: 'Ürün fiyatı' },
            { name: 'category', type: 'string', required: true, description: 'Ürün kategorisi' },
            { name: 'stock', type: 'number', required: true, description: 'Stok miktarı' },
            { name: 'images', type: 'string[]', required: false, description: 'Ürün görselleri' }
          ],
          response: {
            status: 201,
            data: {
              id: 'string',
              name: 'string',
              description: 'string',
              price: 'number',
              category: 'string',
              stock: 'number',
              images: 'string[]',
              createdAt: 'string',
              updatedAt: 'string'
            }
          }
        },
        {
          method: 'PUT',
          path: '/api/products/{id}',
          description: 'Ürün güncelle',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Ürün ID (path parameter)' },
            { name: 'name', type: 'string', required: false, description: 'Ürün adı' },
            { name: 'description', type: 'string', required: false, description: 'Ürün açıklaması' },
            { name: 'price', type: 'number', required: false, description: 'Ürün fiyatı' },
            { name: 'category', type: 'string', required: false, description: 'Ürün kategorisi' },
            { name: 'stock', type: 'number', required: false, description: 'Stok miktarı' }
          ],
          response: {
            status: 200,
            data: {
              id: 'string',
              name: 'string',
              description: 'string',
              price: 'number',
              category: 'string',
              stock: 'number',
              images: 'string[]',
              updatedAt: 'string'
            }
          }
        },
        {
          method: 'DELETE',
          path: '/api/products/{id}',
          description: 'Ürün sil',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Ürün ID (path parameter)' }
          ],
          response: {
            status: 200,
            data: {
              message: 'string',
              deleted: 'boolean'
            }
          }
        }
      ]
    },
    {
      id: 'orders',
      name: 'Orders API',
      description: 'Sipariş yönetimi için API endpoints',
      baseUrl: '/api/orders',
      methods: [
        {
          method: 'GET',
          path: '/api/orders',
          description: 'Tüm siparişleri listele',
          parameters: [
            { name: 'page', type: 'number', required: false, description: 'Sayfa numarası' },
            { name: 'limit', type: 'number', required: false, description: 'Sayfa başına sipariş sayısı' },
            { name: 'status', type: 'string', required: false, description: 'Sipariş durumu filtresi' },
            { name: 'customer', type: 'string', required: false, description: 'Müşteri ID filtresi' }
          ],
          response: {
            status: 200,
            data: {
              orders: [
                {
                  id: 'string',
                  customerId: 'string',
                  customerName: 'string',
                  items: 'object[]',
                  total: 'number',
                  status: 'string',
                  createdAt: 'string',
                  updatedAt: 'string'
                }
              ],
              pagination: {
                page: 'number',
                limit: 'number',
                total: 'number',
                pages: 'number'
              }
            }
          }
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics API',
      description: 'Analitik veriler için API endpoints',
      baseUrl: '/api/analytics',
      methods: [
        {
          method: 'GET',
          path: '/api/analytics/dashboard',
          description: 'Dashboard analitik verileri',
          parameters: [
            { name: 'period', type: 'string', required: false, description: 'Zaman aralığı (7d, 30d, 90d)' },
            { name: 'metric', type: 'string', required: false, description: 'Metrik türü (revenue, orders, customers)' }
          ],
          response: {
            status: 200,
            data: {
              revenue: 'number',
              orders: 'number',
              customers: 'number',
              conversionRate: 'number',
              trends: 'object'
            }
          }
        }
      ]
    }
  ];

  const selectedEndpointData = endpoints.find(ep => ep.id === selectedEndpoint);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">API dokümantasyonu yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Dokümantasyonu</h1>
            <p className="text-gray-600 mt-1">TDC Products API referansı ve test araçları</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              📚 Swagger UI
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              🧪 Test Console
            </button>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Anahtarı</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
            </div>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showApiKey ? '🙈' : '👁️'}
            </button>
            <button
              onClick={() => copyToClipboard(apiKey)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              📋 Kopyala
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              🔄 Yenile
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Bu anahtarı güvenli tutun ve sadece güvenilir uygulamalarda kullanın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Endpoints Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedEndpoint === endpoint.id
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-gray-500">{endpoint.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-3">
            {selectedEndpointData && (
              <div className="space-y-6">
                {/* Endpoint Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedEndpointData.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedEndpointData.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-mono text-sm">
                      {selectedEndpointData.baseUrl}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedEndpointData.methods.length} endpoint
                    </span>
                  </div>
                </div>

                {/* Methods */}
                {selectedEndpointData.methods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        method.method === 'GET' ? 'bg-green-100 text-green-800' :
                        method.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        method.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        method.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {method.method}
                      </span>
                      <span className="font-mono text-sm text-gray-700">{method.path}</span>
                    </div>

                    <p className="text-gray-600 mb-4">{method.description}</p>

                    {/* Parameters */}
                    {method.parameters && method.parameters.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Parametreler</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 font-medium text-gray-700">Parametre</th>
                                <th className="text-left py-2 font-medium text-gray-700">Tip</th>
                                <th className="text-left py-2 font-medium text-gray-700">Gerekli</th>
                                <th className="text-left py-2 font-medium text-gray-700">Açıklama</th>
                              </tr>
                            </thead>
                            <tbody>
                              {method.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-b border-gray-100">
                                  <td className="py-2 font-mono text-indigo-600">{param.name}</td>
                                  <td className="py-2 text-gray-600">{param.type}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      param.required 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {param.required ? 'Evet' : 'Hayır'}
                                    </span>
                                  </td>
                                  <td className="py-2 text-gray-600">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Yanıt</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {method.response.status}
                          </span>
                          <span className="text-sm text-gray-600">Success</span>
                        </div>
                        <pre className="text-sm text-gray-700 overflow-x-auto">
                          {JSON.stringify(method.response.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Test Button */}
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        🧪 Test Et
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}
