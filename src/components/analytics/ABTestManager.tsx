'use client';

import { useState, useEffect } from 'react';
import { 
  BeakerIcon, 
  ChartBarIcon, 
  PlayIcon, 
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  variants: {
    id: string;
    name: string;
    traffic: number; // percentage
    config: any;
  }[];
  metrics: {
    visitors: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }[];
  winner?: string;
  confidence: number;
}

interface ABTestManagerProps {
  onTestStart: (test: ABTest) => void;
  onTestStop: (testId: string) => void;
  onTestUpdate: (test: ABTest) => void;
}

export default function ABTestManager({ 
  onTestStart, 
  onTestStop, 
  onTestUpdate 
}: ABTestManagerProps) {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    variants: [
      { id: 'control', name: 'Kontrol', traffic: 50, config: {} },
      { id: 'variant', name: 'Varyant', traffic: 50, config: {} }
    ]
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/ab-tests');
      const data = await response.json();
      if (data.success) {
        setTests(data.tests);
      }
    } catch (error) {
      console.error('A/B testleri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    if (!newTest.name || !newTest.description) return;

    const test: ABTest = {
      id: `test_${Date.now()}`,
      name: newTest.name,
      description: newTest.description,
      status: 'draft',
      startDate: newTest.startDate,
      endDate: newTest.endDate,
      variants: newTest.variants,
      metrics: newTest.variants.map(() => ({
        visitors: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0
      })),
      confidence: 0
    };

    try {
      await onTestStart(test);
      setTests(prev => [...prev, test]);
      setShowCreateForm(false);
      setNewTest({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        variants: [
          { id: 'control', name: 'Kontrol', traffic: 50, config: {} },
          { id: 'variant', name: 'Varyant', traffic: 50, config: {} }
        ]
      });
    } catch (error) {
      console.error('A/B test oluşturulamadı:', error);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      await onTestStart({ ...tests.find(t => t.id === testId)!, status: 'running' });
      setTests(prev => prev.map(t => 
        t.id === testId ? { ...t, status: 'running' as const } : t
      ));
    } catch (error) {
      console.error('A/B test başlatılamadı:', error);
    }
  };

  const handleStopTest = async (testId: string) => {
    try {
      await onTestStop(testId);
      setTests(prev => prev.map(t => 
        t.id === testId ? { ...t, status: 'paused' as const } : t
      ));
    } catch (error) {
      console.error('A/B test durdurulamadı:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Çalışıyor';
      case 'paused':
        return 'Duraklatıldı';
      case 'completed':
        return 'Tamamlandı';
      case 'draft':
      default:
        return 'Taslak';
    }
  };

  const calculateWinner = (test: ABTest) => {
    if (test.metrics.length < 2) return null;
    
    const control = test.metrics[0];
    const variant = test.metrics[1];
    
    if (variant.conversionRate > control.conversionRate) {
      return 'variant';
    } else if (control.conversionRate > variant.conversionRate) {
      return 'control';
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">A/B testleri yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BeakerIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">A/B Test Yöneticisi</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlayIcon className="w-4 h-4" />
          <span>Yeni Test</span>
        </button>
      </div>

      {/* Test Listesi */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <p className="text-sm text-gray-600">{test.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {getStatusText(test.status)}
                  </span>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {test.variants.map((variant, index) => (
                    <div key={variant.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{variant.name}</span>
                        <span className="text-sm text-gray-600">%{variant.traffic}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Ziyaretçi: {test.metrics[index]?.visitors || 0}</div>
                        <div>Dönüşüm: {test.metrics[index]?.conversions || 0}</div>
                        <div>Oran: %{(test.metrics[index]?.conversionRate || 0).toFixed(2)}</div>
                        <div>Gelir: ₺{(test.metrics[index]?.revenue || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {test.status === 'running' && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <ChartBarIcon className="w-4 h-4" />
                      <span>Güven: %{test.confidence.toFixed(1)}</span>
                    </div>
                    {calculateWinner(test) && (
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Kazanan: {test.variants.find(v => v.id === calculateWinner(test))?.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {test.status === 'draft' && (
                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Testi Başlat"
                  >
                    <PlayIcon className="w-4 h-4" />
                  </button>
                )}
                {test.status === 'running' && (
                  <button
                    onClick={() => handleStopTest(test.id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                    title="Testi Durdur"
                  >
                    <PauseIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Test Formu */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Yeni A/B Test Oluştur</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Adı *
                </label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örnek: Ana Sayfa Başlık Testi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newTest.description}
                  onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Test hakkında detaylı bilgi..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={newTest.startDate}
                    onChange={(e) => setNewTest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={newTest.endDate}
                    onChange={(e) => setNewTest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varyantlar
                </label>
                <div className="space-y-2">
                  {newTest.variants.map((variant, index) => (
                    <div key={variant.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...newTest.variants];
                          newVariants[index].name = e.target.value;
                          setNewTest(prev => ({ ...prev, variants: newVariants }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={variant.traffic}
                        onChange={(e) => {
                          const newVariants = [...newTest.variants];
                          newVariants[index].traffic = Number(e.target.value);
                          setNewTest(prev => ({ ...prev, variants: newVariants }));
                        }}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateTest}
                disabled={!newTest.name}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
