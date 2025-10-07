"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Search } from 'lucide-react';
import ShippingTracker from '@/components/shipping/ShippingTracker';

export default function ShippingTrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#CBA135] rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kargo Takibi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Siparişinizin durumunu takip edin. Takip numaranızı girerek kargonuzun nerede olduğunu öğrenebilirsiniz.
          </p>
        </motion.div>

        {/* Quick Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-[#CBA135]" />
              <h2 className="text-lg font-semibold text-gray-900">Hızlı Takip</h2>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Takip numaranızı girin (örn: YT123456789)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent text-lg"
              />
              <button
                onClick={() => {
                  if (trackingNumber.trim()) {
                    // Scroll to tracker component
                    document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                disabled={!trackingNumber.trim()}
                className="px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Takip Et
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tracker Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          id="tracker"
        >
          <ShippingTracker 
            trackingNumber={trackingNumber}
          />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yardım</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Takip Numarası Nerede?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sipariş onay e-postasında</li>
                  <li>• Siparişlerim sayfasında</li>
                  <li>• Kargo firmasının SMS bildiriminde</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Desteklenen Kargo Firmaları</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Yurtiçi Kargo</li>
                  <li>• Aras Kargo</li>
                  <li>• MNG Kargo</li>
                  <li>• PTT Kargo</li>
                  <li>• UPS Kargo</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
