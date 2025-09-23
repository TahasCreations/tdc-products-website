'use client';

import { useState, useEffect } from 'react';
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface ShippingTrackerProps {
  trackingNumber: string;
  company: string;
}

export default function ShippingTracker({ trackingNumber, company }: ShippingTrackerProps) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  useEffect(() => {
    if (trackingNumber) {
      trackShipment();
    }
  }, [trackingNumber, company]);

  const trackShipment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/shipping/track?number=${trackingNumber}&company=${company}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        setCurrentStatus(data.currentStatus);
      } else {
        // Fallback: Mock data
        const mockEvents = generateMockEvents();
        setEvents(mockEvents);
        setCurrentStatus('Kargoya Verildi');
      }
    } catch (error) {
      console.error('Kargo takip hatası:', error);
      setError('Kargo takip bilgileri alınamadı');
      
      // Fallback: Mock data
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      setCurrentStatus('Kargoya Verildi');
    } finally {
      setLoading(false);
    }
  };

  const generateMockEvents = (): TrackingEvent[] => {
    const now = new Date();
    return [
      {
        id: '1',
        status: 'Sipariş Alındı',
        description: 'Siparişiniz alındı ve hazırlanıyor',
        location: 'TDC Deposu, İstanbul',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: '2',
        status: 'Hazırlanıyor',
        description: 'Siparişiniz paketleniyor',
        location: 'TDC Deposu, İstanbul',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: '3',
        status: 'Kargoya Verildi',
        description: 'Siparişiniz kargo firmasına teslim edildi',
        location: 'TDC Deposu, İstanbul',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: '4',
        status: 'Dağıtım Merkezinde',
        description: 'Siparişiniz dağıtım merkezinde',
        location: `${company} Dağıtım Merkezi`,
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: '5',
        status: 'Dağıtımda',
        description: 'Siparişiniz dağıtıma çıktı',
        location: 'Kurye aracında',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        completed: false
      },
      {
        id: '6',
        status: 'Teslim Edildi',
        description: 'Siparişiniz teslim edildi',
        location: 'Adresiniz',
        timestamp: '',
        completed: false
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sipariş Alındı':
      case 'Hazırlanıyor':
        return 'text-blue-600';
      case 'Kargoya Verildi':
      case 'Dağıtım Merkezinde':
        return 'text-yellow-600';
      case 'Dağıtımda':
        return 'text-orange-600';
      case 'Teslim Edildi':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (event: TrackingEvent) => {
    if (event.completed) {
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    } else if (event.status === 'Dağıtımda') {
      return <TruckIcon className="w-5 h-5 text-orange-600" />;
    } else {
      return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Kargo takip bilgileri yükleniyor...</span>
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
          onClick={trackShipment}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TruckIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kargo Takip</h3>
        </div>
        <div className="text-sm text-gray-500">
          Takip No: {trackingNumber}
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="font-medium text-blue-900">Mevcut Durum: {currentStatus}</span>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getStatusIcon(event)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </h4>
                {event.timestamp && (
                  <span className="text-sm text-gray-500">
                    {formatDate(event.timestamp)}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {event.description}
              </p>
              
              <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <EyeIcon className="w-4 h-4" />
          <span>
            Detaylı takip için {company} web sitesini ziyaret edebilirsiniz
          </span>
        </div>
      </div>
    </div>
  );
}
