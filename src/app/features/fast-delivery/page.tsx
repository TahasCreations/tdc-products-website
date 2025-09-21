'use client';

import Link from 'next/link';
import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function FastDeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TruckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Hızlı Teslimat
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Güvenli ve hızlı kargo ile kapınıza kadar
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <ClockIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24 Saat İçinde Kargo</h3>
              <p className="text-gray-600">
                Siparişinizi aldıktan sonra 24 saat içinde kargoya teslim ediyoruz.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <MapPinIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Türkiye Geneli Teslimat</h3>
                <p className="text-gray-600">
                  Türkiye&apos;nin her yerine güvenli ve hızlı teslimat yapıyoruz.
                </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Güvenli Paketleme</h3>
              <p className="text-gray-600">
                Ürünleriniz özel ambalajlarla güvenli şekilde paketlenir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hızlı Teslimat Garantisi
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Siparişinizi hızlı ve güvenli şekilde teslim alın. Gecikme durumunda ücretsiz iade.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i className="ri-shopping-bag-line mr-2"></i>
            Sipariş Ver
          </Link>
        </div>
      </section>
    </div>
  );
}
