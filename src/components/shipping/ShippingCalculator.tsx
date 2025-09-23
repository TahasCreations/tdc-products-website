'use client';

import { useState, useEffect } from 'react';
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ShippingOption {
  id: string;
  name: string;
  company: string;
  price: number;
  estimatedDays: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

interface ShippingCalculatorProps {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  destination: {
    city: string;
    district: string;
    postalCode: string;
  };
  onSelect: (option: ShippingOption) => void;
  selectedOption?: ShippingOption | null;
}

export default function ShippingCalculator({
  weight,
  dimensions,
  destination,
  onSelect,
  selectedOption
}: ShippingCalculatorProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCompanies = [
    {
      id: 'yurtici',
      name: 'Yurtiçi Kargo',
      basePrice: 15,
      pricePerKg: 2,
      estimatedDays: '1-2 iş günü',
      features: ['Ücretsiz kapıda ödeme', 'SMS takip', 'Online takip']
    },
    {
      id: 'mng',
      name: 'MNG Kargo',
      basePrice: 12,
      pricePerKg: 1.8,
      estimatedDays: '1-3 iş günü',
      features: ['Hızlı teslimat', 'Güvenli paketleme', 'Sigorta']
    },
    {
      id: 'aras',
      name: 'Aras Kargo',
      basePrice: 18,
      pricePerKg: 2.2,
      estimatedDays: '2-4 iş günü',
      features: ['Geniş ağ', 'Güvenilir teslimat', 'Müşteri hizmetleri']
    },
    {
      id: 'ptt',
      name: 'PTT Kargo',
      basePrice: 10,
      pricePerKg: 1.5,
      estimatedDays: '2-5 iş günü',
      features: ['Uygun fiyat', 'Tüm Türkiye', 'Resmi kargo']
    },
    {
      id: 'ups',
      name: 'UPS Kargo',
      basePrice: 25,
      pricePerKg: 3,
      estimatedDays: '1-2 iş günü',
      features: ['Uluslararası', 'Hızlı teslimat', 'Premium hizmet']
    }
  ];

  useEffect(() => {
    calculateShippingOptions();
  }, [weight, dimensions, destination]);

  const calculateShippingOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Kargo hesaplama API'si
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight,
          dimensions,
          destination
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOptions(data.options);
      } else {
        // Fallback: Manuel hesaplama
        const calculatedOptions = shippingCompanies.map(company => {
          const basePrice = company.basePrice;
          const weightPrice = weight * company.pricePerKg;
          const totalPrice = basePrice + weightPrice;

          return {
            id: company.id,
            name: company.name,
            company: company.name,
            price: totalPrice,
            estimatedDays: company.estimatedDays,
            description: `${company.name} ile güvenli teslimat`,
            features: company.features,
            icon: <TruckIcon className="w-6 h-6" />
          };
        });

        setOptions(calculatedOptions);
      }
    } catch (error) {
      console.error('Kargo hesaplama hatası:', error);
      setError('Kargo hesaplama sırasında bir hata oluştu');
      
      // Fallback: Manuel hesaplama
      const calculatedOptions = shippingCompanies.map(company => {
        const basePrice = company.basePrice;
        const weightPrice = weight * company.pricePerKg;
        const totalPrice = basePrice + weightPrice;

        return {
          id: company.id,
          name: company.name,
          company: company.name,
          price: totalPrice,
          estimatedDays: company.estimatedDays,
          description: `${company.name} ile güvenli teslimat`,
          features: company.features,
          icon: <TruckIcon className="w-6 h-6" />
        };
      });

      setOptions(calculatedOptions);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Kargo seçenekleri hesaplanıyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <span className="text-lg font-semibold text-red-600">Hata</span>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={calculateShippingOptions}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TruckIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Kargo Seçenekleri</h3>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedOption?.id === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(option)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {option.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{option.estimatedDays}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{destination.city}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(option.price)}
                </div>
                {selectedOption?.id === option.id && (
                  <div className="flex items-center space-x-1 text-blue-600 text-sm mt-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Seçildi</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {option.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="text-center py-8">
          <TruckIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Kargo seçeneği bulunamadı</p>
        </div>
      )}
    </div>
  );
}
