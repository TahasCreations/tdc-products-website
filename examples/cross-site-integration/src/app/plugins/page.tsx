'use client';

import { useEffect, useState } from 'react';
import { enhancedPluginRegistry } from '../../src/lib/plugin-system/registry-enhanced';

interface PluginStatus {
  name: string;
  loaded: boolean;
  enabled: boolean;
  config?: any;
  dependencies?: string[];
  dependents?: string[];
  lastInit?: string;
  lastError?: string;
}

export default function PluginManagerPage() {
  const [plugins, setPlugins] = useState<PluginStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadPluginStatus() {
      try {
        setLoading(true);
        setError(null);

        const registry = await enhancedPluginRegistry;
        const pluginList = registry.list();
        
        // Plugin detaylarını al
        const pluginDetails = pluginList.map(name => {
          const status = registry.getStatus(name);
          return {
            name,
            loaded: status.loaded,
            enabled: status.enabled,
            config: status.config,
            dependencies: status.dependencies || [],
            dependents: status.dependents || [],
            lastInit: status.lastInit,
            lastError: status.lastError
          };
        });
        
        setPlugins(pluginDetails);
      } catch (error) {
        console.error('Failed to load plugin status:', error);
        setError('Plugin durumu yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    loadPluginStatus();
  }, []);

  const togglePlugin = async (pluginName: string, enabled: boolean) => {
    try {
      setActionLoading(pluginName);
      setError(null);

      const registry = await enhancedPluginRegistry;
      
      if (enabled) {
        // Default konfigürasyon ile etkinleştir
        const defaultConfig = getDefaultConfig(pluginName);
        await registry.enable(pluginName, defaultConfig);
      } else {
        await registry.disable(pluginName);
      }

      // Plugin listesini yenile
      const pluginList = registry.list();
      const pluginDetails = pluginList.map(name => {
        const status = registry.getStatus(name);
        return {
          name,
          loaded: status.loaded,
          enabled: status.enabled,
          config: status.config,
          dependencies: status.dependencies || [],
          dependents: status.dependents || [],
          lastInit: status.lastInit,
          lastError: status.lastError
        };
      });
      
      setPlugins(pluginDetails);
    } catch (error) {
      console.error(`Failed to ${enabled ? 'enable' : 'disable'} plugin:`, error);
      setError(`Plugin ${enabled ? 'etkinleştirilirken' : 'devre dışı bırakılırken'} hata oluştu`);
    } finally {
      setActionLoading(null);
    }
  };

  const getDefaultConfig = (pluginName: string) => {
    const configs: Record<string, any> = {
      'ecommerce': {
        enabled: true,
        settings: { 
          currency: 'TRY', 
          taxRate: 0.18,
          autoSync: true,
          syncInterval: 300000
        }
      },
      'pricing-plugin': {
        enabled: true,
        settings: { 
          currency: 'TRY',
          defaultMarkup: 1.2
        }
      },
      'logger': {
        enabled: true,
        level: 'info'
      }
    };
    
    return configs[pluginName] || { enabled: true };
  };

  const getPluginIcon = (pluginName: string) => {
    const icons: Record<string, string> = {
      'ecommerce': '🛍️',
      'pricing-plugin': '💰',
      'logger': '📝',
      'analytics': '📊',
      'security': '🔒',
      'performance': '⚡'
    };
    
    return icons[pluginName] || '🔌';
  };

  const getPluginDescription = (pluginName: string) => {
    const descriptions: Record<string, string> = {
      'ecommerce': 'Ürün yönetimi, kategori sistemi ve sipariş takibi',
      'pricing-plugin': 'Dinamik fiyat hesaplama ve vergi hesaplamaları',
      'logger': 'Merkezi log yönetimi ve hata takibi',
      'analytics': 'Kullanıcı davranış analizi ve raporlama',
      'security': 'Güvenlik denetimi ve tehdit tespiti',
      'performance': 'Performans izleme ve optimizasyon önerileri'
    };
    
    return descriptions[pluginName] || 'Özel plugin';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Plugin durumu yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plugin Yöneticisi</h1>
          <p className="text-gray-600">
            Sistem plugin'lerini yönetin ve durumlarını izleyin
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {plugins.length} Plugin
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {plugins.filter(p => p.enabled).length} Aktif
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {plugins.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz plugin bulunmuyor
          </h3>
          <p className="text-gray-600">
            Plugin'leri keşfetmek için sistem başlatılıyor...
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {plugins.map((plugin) => (
            <div key={plugin.name} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">
                      {getPluginIcon(plugin.name)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {plugin.name.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {getPluginDescription(plugin.name)}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          plugin.loaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plugin.loaded ? 'Yüklü' : 'Yüklenmemiş'}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          plugin.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {plugin.enabled ? 'Aktif' : 'Pasif'}
                        </span>
                        
                        {plugin.lastInit && (
                          <span className="text-gray-500">
                            Son başlatma: {new Date(plugin.lastInit).toLocaleString('tr-TR')}
                          </span>
                        )}
                      </div>
                      
                      {plugin.dependencies.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Bağımlılıklar: </span>
                          <span className="text-xs text-blue-600">
                            {plugin.dependencies.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {plugin.dependents.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">Bağımlı plugin'ler: </span>
                          <span className="text-xs text-orange-600">
                            {plugin.dependents.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {plugin.lastError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <strong>Hata:</strong> {plugin.lastError}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => togglePlugin(plugin.name, !plugin.enabled)}
                      disabled={actionLoading === plugin.name}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        plugin.enabled
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {actionLoading === plugin.name ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          İşleniyor...
                        </div>
                      ) : (
                        plugin.enabled ? 'Devre Dışı Bırak' : 'Etkinleştir'
                      )}
                    </button>
                    
                    {plugin.enabled && (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Yapılandır
                      </button>
                    )}
                  </div>
                </div>
                
                {plugin.config && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Mevcut Konfigürasyon:</h4>
                    <pre className="bg-gray-50 rounded p-3 text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(plugin.config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plugin Sistemi Bilgileri */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Plugin Sistemi Hakkında
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Özellikler:</h4>
            <ul className="space-y-1">
              <li>• Otomatik plugin keşfi</li>
              <li>• Bağımlılık yönetimi</li>
              <li>• Hot reload desteği</li>
              <li>• Konfigürasyon yönetimi</li>
              <li>• Hata yönetimi ve loglama</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Desteklenen Formatlar:</h4>
            <ul className="space-y-1">
              <li>• TypeScript/JavaScript</li>
              <li>• Python (Pydantic)</li>
              <li>• JSON/YAML konfigürasyon</li>
              <li>• Environment variables</li>
              <li>• Runtime konfigürasyon</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
