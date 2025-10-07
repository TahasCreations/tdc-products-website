"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, Clock, MapPin, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface ShippingOption {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  price: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  deliveryTime: string;
  features: string[];
  isRecommended?: boolean;
  trackingUrl?: string;
}

interface ShippingCalculatorProps {
  items: Array<{
    productId: string;
    quantity: number;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>;
  destination: {
    city: string;
    district?: string;
    postalCode?: string;
    country?: string;
  };
  onOptionSelect?: (option: ShippingOption) => void;
  selectedOption?: string;
}

export default function ShippingCalculator({
  items,
  destination,
  onOptionSelect,
  selectedOption
}: ShippingCalculatorProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalWeight: number;
    totalVolume: number;
    totalValue: number;
    itemCount: number;
  } | null>(null);

  useEffect(() => {
    if (items.length > 0 && destination.city) {
      calculateShipping();
    }
  }, [items, destination]);

  const calculateShipping = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          destination,
          origin: {
            city: 'İstanbul', // Default origin
            district: 'Merkez'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Kargo hesaplama başarısız');
      }

      const data = await response.json();
      setOptions(data.options);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: ShippingOption) => {
    onOptionSelect?.(option);
  };

  const getStatusIcon = (option: ShippingOption) => {
    if (option.isRecommended) {
      return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
    }
    if (option.estimatedDays.min <= 1) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-blue-500" />;
  };

  const getStatusColor = (option: ShippingOption) => {
    if (option.isRecommended) {
      return 'border-yellow-200 bg-yellow-50';
    }
    if (option.estimatedDays.min <= 1) {
      return 'border-green-200 bg-green-50';
    }
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#CBA135] rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Kargo Seçenekleri</h3>
          <p className="text-sm text-gray-600">
            {destination.city} için kargo seçenekleri
          </p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{summary.itemCount}</div>
              <div className="text-gray-600">Ürün</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{summary.totalWeight} kg</div>
              <div className="text-gray-600">Ağırlık</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{summary.totalVolume.toFixed(0)} cm³</div>
              <div className="text-gray-600">Hacim</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">₺{summary.totalValue.toFixed(2)}</div>
              <div className="text-gray-600">Değer</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CBA135] mx-auto"></div>
          <p className="mt-2 text-gray-600">Kargo seçenekleri hesaplanıyor...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Shipping Options */}
      <AnimatePresence>
        {options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOption === option.id
                    ? 'border-[#CBA135] bg-[#CBA135]/5'
                    : getStatusColor(option)
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {/* Recommended Badge */}
                {option.isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Önerilen
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      {option.logoUrl ? (
                        <img
                          src={option.logoUrl}
                          alt={option.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{option.name}</h4>
                        {getStatusIcon(option)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {option.deliveryTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {destination.city}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {option.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {option.price === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        `₺${option.price.toFixed(2)}`
                      )}
                    </div>
                    {option.price > 0 && (
                      <div className="text-sm text-gray-500">
                        {summary && summary.totalValue >= 150 ? 'Ücretsiz kargo için ₺' + (150 - summary.totalValue).toFixed(2) + ' daha ekle' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedOption === option.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#CBA135]" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Options */}
      {!loading && options.length === 0 && !error && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Bu bölge için kargo seçeneği bulunamadı</p>
        </div>
      )}
    </div>
  );
}
