"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Package, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface TrackingEvent {
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
  statusCode: string;
}

interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  isDelivered: boolean;
  deliveryDate?: string;
  trackingUrl?: string;
}

interface OrderInfo {
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    productTitle: string;
    quantity: number;
    image?: string;
  }>;
}

interface ShippingTrackerProps {
  trackingNumber: string;
  carrier?: string;
}

export default function ShippingTracker({ trackingNumber, carrier }: ShippingTrackerProps) {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackPackage = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          carrier
        }),
      });

      if (!response.ok) {
        throw new Error('Takip bilgisi alınamadı');
      }

      const data = await response.json();
      setTrackingInfo(data.tracking);
      setOrderInfo(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_TRANSIT':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'PICKED_UP':
        return <Package className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'DELIVERED':
        return 'bg-green-500';
      case 'IN_TRANSIT':
        return 'bg-blue-500';
      case 'PICKED_UP':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (statusCode: string) => {
    switch (statusCode) {
      case 'DELIVERED':
        return 'Teslim Edildi';
      case 'IN_TRANSIT':
        return 'Yolda';
      case 'PICKED_UP':
        return 'Alındı';
      case 'PENDING':
        return 'Beklemede';
      default:
        return 'Bilinmeyen';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#CBA135] rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Kargo Takibi</h3>
          <p className="text-sm text-gray-600">Siparişinizin durumunu takip edin</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingInfo(null)}
            placeholder="Takip numaranızı girin"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
          />
          <button
            onClick={trackPackage}
            disabled={loading || !trackingNumber.trim()}
            className="px-6 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Aranıyor...' : 'Takip Et'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CBA135] mx-auto"></div>
          <p className="mt-2 text-gray-600">Takip bilgileri alınıyor...</p>
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

      {/* Order Info */}
      {orderInfo && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Sipariş Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Sipariş No</div>
              <div className="font-medium">{orderInfo.orderNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Durum</div>
              <div className="font-medium">{orderInfo.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Toplam</div>
              <div className="font-medium">₺{orderInfo.totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-2">Ürünler</div>
            <div className="space-y-2">
              {orderInfo.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-sm">{item.productTitle}</div>
                    <div className="text-xs text-gray-600">Adet: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Info */}
      {trackingInfo && (
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Takip Bilgileri</h4>
                <p className="text-sm text-gray-600">
                  {trackingInfo.carrier} - {trackingInfo.trackingNumber}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  trackingInfo.isDelivered
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {getStatusIcon(trackingInfo.status.toUpperCase())}
                  {getStatusText(trackingInfo.status.toUpperCase())}
                </div>
              </div>
            </div>

            {trackingInfo.estimatedDelivery && !trackingInfo.isDelivered && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Tahmini teslimat: {formatDate(trackingInfo.estimatedDelivery)}
                  </span>
                </div>
              </div>
            )}

            {trackingInfo.isDelivered && trackingInfo.deliveryDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Teslim edildi: {formatDate(trackingInfo.deliveryDate)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Takip Geçmişi</h4>
            <div className="space-y-4">
              {trackingInfo.events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(event.statusCode)}`}></div>
                    {index < trackingInfo.events.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.statusCode)}
                        <span className="font-medium text-gray-900">{event.description}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(event.date)} {event.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* External Tracking Link */}
          {trackingInfo.trackingUrl && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">Detaylı Takip</h5>
                  <p className="text-sm text-gray-600">
                    {trackingInfo.carrier} resmi sitesinde detaylı takip yapabilirsiniz
                  </p>
                </div>
                <a
                  href={trackingInfo.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Takip Et
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
