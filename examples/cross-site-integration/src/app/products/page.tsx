'use client';

import { useEffect, useState } from 'react';
import { enhancedPluginRegistry } from '../../src/lib/plugin-system/registry-enhanced';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  color: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pluginStatus, setPluginStatus] = useState<{
    loaded: boolean;
    enabled: boolean;
  }>({ loaded: false, enabled: false });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const registry = await enhancedPluginRegistry;
        
        // Plugin durumunu kontrol et
        const status = registry.getStatus('ecommerce');
        setPluginStatus({
          loaded: status.loaded,
          enabled: status.enabled
        });

        if (status.loaded && status.enabled) {
          const ecommercePlugin = registry.get('ecommerce');
          
          if (ecommercePlugin) {
            const api = ecommercePlugin.getPublicAPI();
            const productList = await api.products.list();
            setProducts(productList || []);
          }
        } else {
          setError('E-commerce plugin yüklü veya etkin değil');
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Ürünler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-800">Hata</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Plugin Durumu:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Yüklenmiş: {pluginStatus.loaded ? '✅' : '❌'}</div>
            <div>Etkin: {pluginStatus.enabled ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600">
            E-commerce plugin'inden yüklenen {products.length} ürün
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pluginStatus.loaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Plugin: {pluginStatus.loaded ? 'Yüklü' : 'Yüklenmemiş'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pluginStatus.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Durum: {pluginStatus.enabled ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz ürün bulunmuyor
          </h3>
          <p className="text-gray-600">
            E-commerce plugin'ini yapılandırın ve ürün ekleyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3" style={{ color: product.color }}>
                    {product.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {product.price} TL
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Sepete Ekle
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Eklenme: {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
